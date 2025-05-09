import { CircleDashed } from "lucide-react";
import { useFormStatus } from "react-dom";

interface SubmitButtonProps {
  text: string;
}

export const SubmitButton = ({ text }: SubmitButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
    >
      {pending ? (
        <div className="flex items-center">
          <CircleDashed className="w-4 h-4 mr-2 text-white animate-spin" />
          <span>Memproses...</span>
        </div>
      ) : (
        text
      )}
    </button>
  );
};
