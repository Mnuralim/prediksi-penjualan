"use client";

import Table, { type TableColumn } from "@/app/_components/table";
import Form from "next/form";
import React, { useState } from "react";
import { Edit, Trash2, User } from "lucide-react";
import { Modal } from "@/app/_components/modal";
import { SubmitButton } from "@/app/_components/button";
import { useFormState } from "react-dom";
import { ErrorMessage } from "@/app/_components/error-message";
import { ActionButtons } from "@/app/_components/action-button";
import type { Admin } from "@prisma/client";
import { createUser, deleteUser, updateUser } from "@/actions/user";

const roles = [
  { value: "ADMIN", label: "Admin" },
  { value: "OWNER", label: "Owner" },
  { value: "CASHIER", label: "Kasir" },
];

interface Props {
  users: Admin[];
  role?: "ADMIN" | "OWNER" | "CASHIER";
}

export const UserList = ({ users, role }: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<Admin | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");

  const [createState, formActionCreate] = useFormState(createUser, {
    error: null,
  });

  const [updateState, formActionUpdate] = useFormState(updateUser, {
    error: null,
  });

  const columns: TableColumn<Admin>[] = [
    {
      header: "ID",
      accessor: "id",
      sortable: true,
      className: "w-16",
      render: (admin) => (
        <div className="font-mono text-xs text-gray-500">
          {admin.id.slice(0, 8)}...
        </div>
      ),
    },
    {
      header: "Avatar",
      accessor: () => null,
      sortable: false,
      render: () => (
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      ),
    },
    {
      header: "Nama",
      accessor: "name",
      sortable: true,
      render: (admin) => (
        <div>
          <p className="font-medium text-gray-800 dark:text-gray-200">
            {admin.name}
          </p>
        </div>
      ),
    },
    {
      header: "Email",
      accessor: "email",
      sortable: true,
      render: (admin) => (
        <div className="text-gray-600 dark:text-gray-400">{admin.email}</div>
      ),
    },
    {
      header: "Role",
      accessor: "role",
      sortable: true,
      render: (admin) => {
        const roleColors = {
          OWNER:
            "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
          ADMIN:
            "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
          CASHIER:
            "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
        };

        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              roleColors[admin.role]
            }`}
          >
            {admin.role}
          </span>
        );
      },
    },
    {
      header: "Aksi",
      accessor: () => null,
      className: "w-24",
      render: (admin) =>
        role !== "ADMIN" ? null : (
          <div className="flex space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEditUser(admin);
              }}
              className="p-1.5 text-amber-600 rounded-md hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-900/20"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteUser(admin);
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

  const handleRowClick = (admin: Admin) => {
    console.log("Row clicked:", admin);
  };

  const handleEditUser = (admin: Admin) => {
    setCurrentUser(admin);
    setModalMode("edit");
    setShowModal(true);
  };

  const handleAddUser = () => {
    setCurrentUser(null);
    setModalMode("add");
    setShowModal(true);
  };

  const handleDeleteUser = (admin: Admin) => {
    if (confirm(`Apakah Anda yakin ingin menghapus user "${admin.name}"?`)) {
      deleteUser(admin.id);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentUser(null);
  };

  const getModalTitle = () => {
    return modalMode === "add" ? "Tambah User" : "Edit User";
  };

  const getButtonText = () => {
    return modalMode === "add" ? "Simpan" : "Update";
  };

  return (
    <div className="p-3">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Daftar User
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Kelola semua user admin di sini
          </p>
        </div>
      </div>
      <ActionButtons
        role={role}
        handleAddItem={handleAddUser}
        title={"Tambah User"}
      />
      <Table
        data={users}
        columns={columns}
        searchable={true}
        pagination={true}
        rowsPerPageOptions={[50, 75, 100, 500]}
        onRowClick={handleRowClick}
        striped={true}
        hovered={true}
        title="Data User"
        description="Daftar lengkap user admin dengan role mereka"
        emptyMessage="Tidak ada user yang ditemukan"
      />
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={getModalTitle()}
        size="lg"
      >
        <Form
          id="user-form"
          action={modalMode === "add" ? formActionCreate : formActionUpdate}
          className="space-y-6"
        >
          {modalMode === "edit" && currentUser && (
            <input type="hidden" name="id" value={currentUser.id} />
          )}

          {updateState.error || createState.error ? (
            <ErrorMessage message={updateState.error || createState.error} />
          ) : null}

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Nama Lengkap
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Masukkan nama lengkap"
              defaultValue={currentUser?.name || ""}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Masukkan alamat email"
              defaultValue={currentUser?.email || ""}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Role
            </label>
            <select
              name="role"
              id="role"
              defaultValue={currentUser?.role || "ADMIN"}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              required
            >
              {roles.map((roleOption) => (
                <option key={roleOption.value} value={roleOption.value}>
                  {roleOption.label}
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
