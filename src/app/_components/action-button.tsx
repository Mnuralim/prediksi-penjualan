import { Plus } from "lucide-react";
import React from "react";

interface Props {
  handleAddItem: () => void;
  title: string;
}

export const ActionButtons = ({ handleAddItem, title }: Props) => (
  <div className="flex items-center gap-3 mb-6">
    <button
      onClick={handleAddItem}
      className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors shadow-sm"
    >
      <Plus className="w-4 h-4" />
      <span>{title}</span>
    </button>
  </div>
);
