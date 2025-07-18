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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Edit, Trash2, MoreVertical, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface Post {
  id: number;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  status: "published" | "draft" | "archived";
  views: number;
}

interface PostsDataTableProps {
  onEditPost?: (post: Post) => void;
}

const defaultData: Post[] = [
  { id: 1, title: "Bitcoin Analizi", category: "Bitcoin", date: "2024-07-01", excerpt: "Bitcoin fiyatı yükseliyor...", status: "published", views: 1200 },
  { id: 2, title: "Ethereum Merge", category: "Ethereum", date: "2024-06-28", excerpt: "Merge sonrası gelişmeler...", status: "published", views: 950 },
  { id: 3, title: "NFT Trendleri", category: "NFT", date: "2024-06-25", excerpt: "NFT piyasasında son durum...", status: "published", views: 800 },
  { id: 4, title: "DeFi Nedir?", category: "DeFi", date: "2024-06-20", excerpt: "DeFi dünyasına giriş...", status: "draft", views: 0 },
  { id: 5, title: "Kripto Güvenliği", category: "Güvenlik", date: "2024-06-15", excerpt: "Kripto varlıklarınızı koruyun...", status: "published", views: 650 },
  { id: 6, title: "Altcoin Sezonu", category: "Altcoin", date: "2024-06-10", excerpt: "Altcoin piyasasında hareketlilik...", status: "published", views: 450 },
  { id: 7, title: "Stablecoin Nedir?", category: "Stablecoin", date: "2024-06-05", excerpt: "Stablecoin'lerin avantajları...", status: "archived", views: 320 },
  { id: 8, title: "Cüzdan Güvenliği", category: "Güvenlik", date: "2024-06-01", excerpt: "Kripto cüzdanınızı koruyun...", status: "published", views: 780 },
  { id: 9, title: "Layer 2 Çözümleri", category: "Ethereum", date: "2024-05-28", excerpt: "Ethereum Layer 2 projeleri...", status: "draft", views: 0 },
  { id: 10, title: "Kripto Vergilendirme", category: "Regülasyon", date: "2024-05-20", excerpt: "Kripto vergilendirme rehberi...", status: "published", views: 890 },
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

const getStatusBadge = (status: string) => {
  switch (status) {
    case "published":
      return <Badge className="bg-green-100 text-green-700 border-0">Yayında</Badge>;
    case "draft":
      return <Badge className="bg-yellow-100 text-yellow-700 border-0">Taslak</Badge>;
    case "archived":
      return <Badge className="bg-gray-100 text-gray-700 border-0">Arşiv</Badge>;
    default:
      return null;
  }
};

export default function PostsDataTable({ onEditPost }: PostsDataTableProps) {
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
        header: () => <span className="font-medium">Başlık</span>,
        cell: info => (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <span className="text-xs font-bold text-gray-600 dark:text-gray-400">
                {(info.getValue() as string).charAt(0)}
              </span>
            </div>
            <div>
              <span className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                {info.getValue() as string}
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                {info.row.original.excerpt}
              </p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "category",
        header: () => <span className="font-medium">Kategori</span>,
        cell: info => (
          <Badge variant="outline" className="text-xs">
            {info.getValue() as string}
          </Badge>
        ),
      },
      {
        accessorKey: "status",
        header: () => <span className="font-medium">Durum</span>,
        cell: info => getStatusBadge(info.getValue() as string),
      },
      {
        accessorKey: "views",
        header: () => <span className="font-medium">Görüntülenme</span>,
        cell: info => (
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {info.getValue() as number}
          </span>
        ),
      },
      {
        accessorKey: "date",
        header: () => <span className="font-medium">Tarih</span>,
        cell: info => (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        id: "actions",
        header: () => <span className="font-medium">İşlemler</span>,
        cell: info => (
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Eye className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => onEditPost?.(info.row.original)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [selectedRows, onEditPost]
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
    <div className="w-full space-y-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Input
              placeholder="Başlık, kategori veya özet ara..."
              value={globalFilter ?? ""}
              onChange={e => setGlobalFilter(e.target.value)}
              className="w-80"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Kategori seçin" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-3">
          {selectedRows.length > 0 && (
            <Badge variant="secondary">
              {selectedRows.length} seçili
            </Badge>
          )}
          {selectedRows.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleBulkDelete}>
              Seçilenleri Sil
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white dark:bg-black divide-y divide-gray-200 dark:divide-gray-700">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    Sonuç bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Sayfa {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
          </p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={value => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 40, 50].map(pageSize => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 