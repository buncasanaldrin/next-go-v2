"use client";

import { toast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/types/api";

type Props = {
  id: number;
  onDelete: (id: number) => Promise<ApiResponse<{}>>;
  message: string;
  children: React.ReactNode;
};

const TableDeleteItem: React.FC<Props> = ({
  id,
  onDelete,
  message,
  children,
}) => {
  const handleDelete = async () => {
    try {
      const { error } = await onDelete(id);
      if (error) {
        return toast({ variant: "destructive", description: error });
      }

      toast({
        description: message,
        duration: 2000,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "An unexpected error occured. Please try again later.",
      });
    }
  };

  return <div onClick={handleDelete}>{children}</div>;
};

export default TableDeleteItem;
