"use client";
import Table, { type TableColumn } from "@/app/_components/table";
import Form from "next/form";
import React, { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { Modal } from "@/app/_components/modal";
import { weekUtils } from "@/lib/utils";
import { useFormState } from "react-dom";
import { createSales, deleteSales, updateSales } from "@/actions/sales";
import { ErrorMessage } from "@/app/_components/error-message";
import { SubmitButton } from "@/app/_components/button";
import { ActionButtons } from "@/app/_components/action-button";
import type { Item, Prisma } from "@prisma/client";

type Sale = Prisma.SaleGetPayload<{
  include: {
    item: true;
  };
}>;

interface Props {
  sales: Sale[];
  items: Item[];
  role?: "ADMIN" | "OWNER" | "CASHIER";
}

export const SalesList = ({ sales, items, role }: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState<Sale | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");

  const [createState, formActionCreate] = useFormState(createSales, {
    error: null,
  });

  const [updateState, formActionUpdate] = useFormState(updateSales, {
    error: null,
  });

  const { weekOptions } = weekUtils();

  const columns: TableColumn<Sale>[] = [
    {
      header: "Minggu ke-",
      accessor: "week",
      sortable: true,
      render: (item) => (
        <div>
          <p className="font-medium text-gray-800 dark:text-gray-200">
            {item.week}
          </p>
        </div>
      ),
    },
    {
      header: "Nama Barang",
      accessor: (item) => item.item.name,
      render: (item) => (
        <div>
          <p className="font-medium text-gray-800 dark:text-gray-200">
            {item.item.name}
          </p>
        </div>
      ),
    },

    {
      header: "Penjualan",
      accessor: "quantity",
      sortable: true,
      render: (item) => (
        <div className="font-medium">
          {item.quantity <= 5 ? (
            <span className="text-red-600 dark:text-red-400">
              {item.quantity}
            </span>
          ) : item.quantity <= 20 ? (
            <span className="text-amber-600 dark:text-amber-400">
              {item.quantity}
            </span>
          ) : (
            <span>{item.quantity}</span>
          )}
        </div>
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
                handleDeleteSales(item);
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

  const handleRowClick = (item: Sale) => {
    console.log("Row clicked:", item);
  };

  const handleEditItem = (item: Sale) => {
    setCurrentItem(item);
    setModalMode("edit");
    setShowModal(true);
  };

  const handleAddItem = () => {
    setCurrentItem(null);
    setModalMode("add");
    setShowModal(true);
  };

  const handleDeleteSales = (item: Sale) => {
    if (confirm(`Apakah Anda yakin ingin menghapus penjualan "${item.id}"?`)) {
      deleteSales(item.id);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentItem(null);
  };

  const getModalTitle = () => {
    return modalMode === "add" ? "Tambah Penjualan" : "Edit Penjualan";
  };

  const getButtonText = () => {
    return modalMode === "add" ? "Simpan" : "Update";
  };

  return (
    <div className="p-3">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Daftar Penjualan
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Kelola semua penjualan Anda di sini
          </p>
        </div>
      </div>
      <ActionButtons
        role={role}
        handleAddItem={handleAddItem}
        title="Tambah Penjualan"
      />
      <Table
        data={sales}
        columns={columns}
        searchable={true}
        pagination={true}
        rowsPerPageOptions={[50, 100, 200, 500]}
        onRowClick={handleRowClick}
        striped={true}
        hovered={true}
        title="Data Penjualan"
        description="Daftar lengkap penjualan Anda"
        emptyMessage="Tidak ada penjualan yang ditemukan"
      />
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={getModalTitle()}
        size="xl"
      >
        <Form
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
              htmlFor="item-id"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Pilih Barang
            </label>
            <select
              name="item-id"
              id="item-id"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            >
              {items.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                  selected={currentItem?.itemId === item.id}
                >
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="week"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Pilih Minggu
            </label>
            <select
              name="week"
              id="week"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            >
              {weekOptions.map((week) => (
                <option
                  key={week}
                  value={week}
                  selected={currentItem?.week === week}
                >
                  {week}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="total-sales"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Jumlah Penjualan
            </label>
            <input
              type="number"
              id="total-sales"
              name="total-sales"
              min={1}
              placeholder="Masukkan jumlah penjualan"
              defaultValue={currentItem?.quantity || ""}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              required
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
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
