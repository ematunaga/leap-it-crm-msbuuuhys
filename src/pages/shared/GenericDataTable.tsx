import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useState } from 'react'

interface Column<T> {
  key: keyof T | string
  label: string
  render?: (val: any, item: T) => React.ReactNode
}

interface GenericDataTableProps<T> {
  title: string
  subtitle?: string
  data: T[]
  columns: Column<T>[]
  searchKey?: keyof T
}

export function GenericDataTable<T>({
  title,
  subtitle,
  data,
  columns,
  searchKey,
}: GenericDataTableProps<T>) {
  const [search, setSearch] = useState('')

  const filteredData = data.filter((item) => {
    if (!search || !searchKey) return true
    const val = item[searchKey]
    return String(val).toLowerCase().includes(search.toLowerCase())
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        {searchKey && (
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              className="pl-9 bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="rounded-xl border bg-card shadow-subtle overflow-hidden">
        {filteredData.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">Nenhum registro encontrado.</div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                {columns.map((c) => (
                  <TableHead key={String(c.key)}>{c.label}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((row, i) => (
                <TableRow key={i} className="hover:bg-muted/30 transition-colors">
                  {columns.map((c) => {
                    const value = c.key in (row as any) ? (row as any)[c.key] : null
                    return (
                      <TableCell key={String(c.key)} className="py-3">
                        {c.render ? c.render(value, row) : value}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
