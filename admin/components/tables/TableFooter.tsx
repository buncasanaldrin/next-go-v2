import { ApiMetadata } from "@/types/api";
import TablePagination from "@/components/tables/TablePagination";

type Props = {
  metadata: ApiMetadata;
};

const TableFooter: React.FC<Props> = ({ metadata }) => {
  const { current_page, last_page, page_size, total_records } = metadata;

  const start = (current_page - 1) * page_size + 1;
  const end = Math.min(current_page * page_size, total_records);

  return (
    <div className="flex items-center justify-around mt-10">
      <div className="text-xs text-muted-foreground w-full">
        Showing{" "}
        <strong>
          {start}-{end}
        </strong>{" "}
        of <strong>{total_records}</strong> products
      </div>
      <div className="flex justify-end">
        <TablePagination
          pageNumber={+current_page}
          isNext={current_page < last_page}
          metadata={metadata}
        />
      </div>
    </div>
  );
};

export default TableFooter;
