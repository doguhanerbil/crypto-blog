"use client";
import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface Post {
  id: number;
  title: string;
  category: string;
  date: string;
  excerpt: string;
}

const defaultData: Post[] = [
  { id: 1, title: "Bitcoin Analizi", category: "Bitcoin", date: "2024-07-01", excerpt: "Bitcoin fiyatı yükseliyor..." },
  { id: 2, title: "Ethereum Merge", category: "Ethereum", date: "2024-06-28", excerpt: "Merge sonrası gelişmeler..." },
  { id: 3, title: "NFT Trendleri", category: "NFT", date: "2024-06-25", excerpt: "NFT piyasasında son durum..." },
  { id: 4, title: "DeFi Nedir?", category: "DeFi", date: "2024-06-20", excerpt: "DeFi dünyasına giriş..." },
  { id: 5, title: "Kripto Güvenliği", category: "Güvenlik", date: "2024-06-15", excerpt: "Kripto varlıklarınızı koruyun..." },
  { id: 6, title: "Altcoin Sezonu", category: "Altcoin", date: "2024-06-10", excerpt: "Altcoin piyasasında hareketlilik..." },
  { id: 7, title: "Stablecoin Nedir?", category: "Stablecoin", date: "2024-06-05", excerpt: "Stablecoin'lerin avantajları..." },
  { id: 8, title: "Cüzdan Güvenliği", category: "Güvenlik", date: "2024-06-01", excerpt: "Kripto cüzdanınızı koruyun..." },
  { id: 9, title: "Layer 2 Çözümleri", category: "Ethereum", date: "2024-05-28", excerpt: "Ethereum Layer 2 projeleri..." },
  { id: 10, title: "Kripto Vergilendirme", category: "Regülasyon", date: "2024-05-20", excerpt: "Kripto vergilendirme rehberi..." },
];

const categories = [
  "Tümü",
  "Bitcoin",
  "Ethereum",
  "NFT",
  "DeFi",
  "Güvenlik",
  "Altcoin",
  "Stablecoin",
  "Regülasyon",
];

export default function PostsDataTable() {
  const [data, setData] = React.useState(() => [...defaultData]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("Tümü");
  const [sorting, setSorting] = React.useState([]);
  const [selectedRows, setSelectedRows] = React.useState<number[]>([]);

  // Bulk delete
  const handleBulkDelete = () => {
    setData(prev => prev.filter(row => !selectedRows.includes(row.id)));
    setSelectedRows([]);
  };

  // Table columns
  const columns = React.useMemo<ColumnDef<Post>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={value => {
              if (value) {
                setSelectedRows(table.getRowModel().rows.map(row => row.original.id));
              } else {
                setSelectedRows([]);
              }
            }}
            aria-label="Tümünü seç"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={selectedRows.includes(row.original.id)}
            onCheckedChange={value => {
              if (value) {
                setSelectedRows(prev => [...prev, row.original.id]);
              } else {
                setSelectedRows(prev => prev.filter(id => id !== row.original.id));
              }
            }}
            aria-label="Satırı seç"
          />
        ),
        size: 32,
      },
      {
        accessorKey: "title",
        header: () => "Başlık",
        cell: info => <span className="font-semibold text-blue-700">{info.getValue() as string}</span>,
      },
      {
        accessorKey: "category",
        header: () => "Kategori",
        cell: info => <Badge className="bg-purple-100 text-purple-700">{info.getValue() as string}</Badge>,
      },
      {
        accessorKey: "date",
        header: () => "Tarih",
        cell: info => <span className="text-xs text-gray-500">{info.getValue() as string}</span>,
      },
      {
        accessorKey: "excerpt",
        header: () => "Özet",
        cell: info => <span className="text-gray-700 line-clamp-1">{info.getValue() as string}</span>,
      },
    ],
    [selectedRows]
  );

  // Filtrelenmiş veri
  const filteredData = React.useMemo(() => {
    let filtered = [...data];
    if (categoryFilter !== "Tümü") {
      filtered = filtered.filter(row => row.category === categoryFilter);
    }
    if (globalFilter) {
      filtered = filtered.filter(row =>
        row.title.toLowerCase().includes(globalFilter.toLowerCase()) ||
        row.category.toLowerCase().includes(globalFilter.toLowerCase()) ||
        row.excerpt.toLowerCase().includes(globalFilter.toLowerCase())
      );
    }
    return filtered;
  }, [data, categoryFilter, globalFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: false,
  });

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <Input
          placeholder="Başlık, kategori veya özet ara..."
          value={globalFilter ?? ""}
          onChange={e => setGlobalFilter(e.target.value)}
          className="max-w-xs"
        />
        <select
          className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <Button
          variant="destructive"
          size="sm"
          disabled={selectedRows.length === 0}
          onClick={handleBulkDelete}
        >
          Seçiliyi Sil ({selectedRows.length})
        </Button>
      </div>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-4 py-2 text-left bg-blue-50 text-blue-700 font-semibold cursor-pointer select-none"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() === "asc" && " ▲"}
                    {header.column.getIsSorted() === "desc" && " ▼"}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="border-b hover:bg-blue-50">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-4 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-4">
        <span className="text-sm text-gray-500">
          Sayfa {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
        </span>
        <span className="text-sm text-gray-500">
          Toplam {filteredData.length} kayıt
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            İlk
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Önceki
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Sonraki
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            Son
          </Button>
        </div>
      </div>
    </div>
  );
} 