import {useCallback, useState} from "react";
import {Button, Empty, TablePaginationConfig} from "antd";
import {useDebounce} from "react-use";
import {useT} from "@/i18n/client";
import ErrorEmpty from "@/components/common/ErrorEmpty";

interface UseServerTableProps {
  initialPageSize?: number;
}

export function useServerTable<T>({initialPageSize = 15}: UseServerTableProps = {}) {
  const {t} = useT();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: initialPageSize,
    total: 0,
  });

  useDebounce(
    () => {
      setDebouncedTerm(searchTerm);
      if (searchTerm !== debouncedTerm) {
        setPagination((prev) => ({...prev, current: 1}));
      }
    },
    300,
    [searchTerm]
  );

  const handleTableChange = useCallback((newPagination: TablePaginationConfig) => {
    setPagination((prev) => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    }));
  }, []);

  const searchProps = {
    placeholder: t("search"),
    value: searchTerm,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value),
  };

  const getTableProps = (
    {
      data,
      total,
      isLoading,
      isError,
      error,
      refetch,
      onAdd,
      addText,
      emptyText,
    }: {
      data?: T[];
      total?: number;
      isLoading: boolean;
      isError: boolean;
      error?: any;
      refetch: () => void;
      onAdd?: () => void;
      addText?: string;
      emptyText?: string;

    }) => ({
    dataSource: data,
    loading: isLoading,
    onChange: handleTableChange,
    pagination: {
      ...pagination,
      total: total || 0,
      showSizeChanger: true,
      pageSizeOptions: ["15", "30", "50", "100"],
      showTotal: (total: number, range: [number, number]) =>
        t("pagination", {start: range[0], end: range[1], total, count: total}),
    },
    locale: {
      emptyText: isError ? (
        <ErrorEmpty error={error} onRetry={refetch}/>
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={emptyText || t("no_data_found")}
        >
          {onAdd && (
            <Button type="primary" onClick={onAdd}>
              {addText || t("add_new")}
            </Button>
          )}
        </Empty>
      ),
    },
  });

  return {
    queryParams: {
      searchTerm: debouncedTerm,
      page: pagination.current || 1,
      pageSize: pagination.pageSize || initialPageSize,
    },
    searchProps,
    getTableProps,
  };
}