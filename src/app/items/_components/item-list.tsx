"use client";

import Table, { type TableColumn } from "@/app/_components/table";
import Form from "next/form";
import React, { useState } from "react";
import { Edit, Trash2, Package } from "lucide-react";
import { Modal } from "@/app/_components/modal";
import { createItem, deleteItem, updateItem } from "@/actions/item";
import Image from "next/image";
import { SubmitButton } from "@/app/_components/button";
import { useFormState } from "react-dom";
import { ErrorMessage } from "@/app/_components/error-message";
import { ActionButtons } from "@/app/_components/action-button";
import type { Item } from "@prisma/client";

const categoris = [
  { value: "alat-pertukangan", label: "Alat Pertukangan" },
  { value: "bahan-bangunan", label: "Bahan Bangunan" },
  { value: "cat-finishing", label: "Cat Finishing" },
  { value: "lantai-dinding", label: "Lantai & Dinding" },
  { value: "perangkat-keras", label: "Perangkat Keras" },
  { value: "lainnya", label: "Lainnya" },
];

interface Props {
  items: Item[];
  role?: "ADMIN" | "OWNER" | "CASHIER";
}

export const ItemList = ({ items, role }: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState<Item | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");

  const [createState, formActionCreate] = useFormState(createItem, {
    error: null,
  });

  const [updateState, formActionUpdate] = useFormState(updateItem, {
    error: null,
  });

  const columns: TableColumn<Item>[] = [
    {
      header: "ID",
      accessor: "id",
      sortable: true,
      className: "w-16",
    },
    {
      header: "Gambar",
      accessor: "photo",
      sortable: false,
      render: (item) => (
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
            {item.photo ? (
              <Image
                width={100}
                height={100}
                src={item.photo}
                alt={`${item.name || "Item"}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <Package className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>
      ),
    },
    {
      header: "Nama Barang",
      accessor: "name",
      sortable: true,
      render: (item) => (
        <div>
          <p className="font-medium text-gray-800 dark:text-gray-200">
            {item.name}
          </p>
        </div>
      ),
    },
    {
      header: "Stok",
      accessor: "stock",
      sortable: true,
      render: (item) => (
        <div className="font-medium">
          {item.stock <= 5 ? (
            <span className="text-red-600 dark:text-red-400">{item.stock}</span>
          ) : item.stock <= 20 ? (
            <span className="text-amber-600 dark:text-amber-400">
              {item.stock}
            </span>
          ) : (
            <span>{item.stock}</span>
          )}
        </div>
      ),
    },
    {
      header: "Harga",
      accessor: "price",
      sortable: true,
      render: (item) => (
        <div className="font-medium">
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(item.price)}
        </div>
      ),
    },
    {
      header: "Kategori",
      accessor: "category",
      sortable: true,
      render: (item) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
          {item.category}
        </span>
      ),
    },
    {
      header: "Aksi",
      accessor: () => null,
      className: "w-24",
      render: (item) =>
        role === "OWNER" ? null : (
          <div className="flex space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEditItem(item);
              }}
              className="p-1.5 text-amber-600 rounded-md hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-900/20"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteItem(item);
              }}
              className="p-1.5 text-red-600 rounded-md hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              title="Hapus"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ),
    },
  ];

  const handleRowClick = (item: Item) => {
    console.log("Row clicked:", item);
  };

  const handleEditItem = (item: Item) => {
    setCurrentItem(item);
    setModalMode("edit");
    setShowModal(true);
  };

  const handleAddItem = () => {
    setCurrentItem(null);
    setModalMode("add");
    setShowModal(true);
  };

  const handleDeleteItem = (item: Item) => {
    if (confirm(`Apakah Anda yakin ingin menghapus barang "${item.name}"?`)) {
      deleteItem(item.id);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentItem(null);
  };

  const getModalTitle = () => {
    return modalMode === "add" ? "Tambah Barang" : "Edit Barang";
  };

  const getButtonText = () => {
    return modalMode === "add" ? "Simpan" : "Update";
  };

  return (
    <div className="p-3">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Daftar Barang
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Kelola semua barang Anda di sini
          </p>
        </div>
      </div>
      <ActionButtons
        role={role}
        handleAddItem={handleAddItem}
        title={"Tambah Barang"}
      />
      <Table
        data={items}
        columns={columns}
        searchable={true}
        pagination={true}
        rowsPerPageOptions={[50, 75, 100, 500]}
        onRowClick={handleRowClick}
        striped={true}
        hovered={true}
        title="Data Barang"
        description="Daftar lengkap barang dengan stok dan harganya"
        emptyMessage="Tidak ada barang yang ditemukan"
      />
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={getModalTitle()}
        size="xl"
      >
        <Form
          id="item-form"
          action={modalMode === "add" ? formActionCreate : formActionUpdate}
          className="space-y-6"
        >
          {modalMode === "edit" && currentItem && (
            <input type="hidden" name="id" value={currentItem.id} />
          )}

          {updateState.error || createState.error ? (
            <ErrorMessage message={updateState.error || createState.error} />
          ) : null}

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Nama Barang
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Masukkan nama barang"
              defaultValue={currentItem?.name || ""}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Gambar Barang
            </label>
            {currentItem?.photo && (
              <div className="mb-2">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Gambar saat ini:
                </p>
                <div className="h-20 w-20 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                  <Image
                    width={100}
                    height={100}
                    src={currentItem.photo}
                    alt={`${currentItem.name || "Item"}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            )}
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              PNG, JPG, GIF sampai 10MB
              {modalMode === "edit" &&
                " (Biarkan kosong jika tidak ingin mengubah gambar)"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="stock"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Stok
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                min="0"
                placeholder="0"
                defaultValue={currentItem?.stock || 0}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Harga (Rp)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                min="0"
                placeholder="0"
                defaultValue={currentItem?.price || 0}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Kategori
            </label>
            <select
              name="category"
              id="category"
              defaultValue={currentItem?.category || ""}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              required
            >
              <option value="">Pilih Kategori</option>
              {categoris.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
            >
              Batal
            </button>
            <SubmitButton text={getButtonText()} />
          </div>
        </Form>
      </Modal>
    </div>
  );
};
