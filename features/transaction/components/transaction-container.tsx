'use client'

import { ComponentType, ReactNode, useMemo, useState } from 'react'
import { UseInfiniteQueryResult, UseQueryResult } from '@tanstack/react-query'
import { TransactionModel, TransactionModelBuilder, TransactionSchema } from '../types'

export interface TransactionListProps<TModel extends TransactionModel> {
  items: TModel[]
  isLoading: boolean
  onSelect: (item: TModel) => void
  selectedId?: string
  pagination?: {
    page: number
    pageSize: number
    totalItems: number
    onPageChange: (nextPage: number) => void
  }
  infinite?: {
    onLoadMore: () => void
    hasMore: boolean
    isFetchingMore: boolean
  }
}

export interface TransactionDetailProps<TModel extends TransactionModel> {
  item?: TModel
  isLoading: boolean
}

export interface TransactionDetailModalProps<TModel extends TransactionModel>
  extends TransactionDetailProps<TModel> {
  open: boolean
  onClose: () => void
}

export interface TransactionFiltersConfig<TFilters extends Record<string, unknown>> {
  initialState: TFilters
}

export interface TransactionFiltersRenderProps<TFilters extends Record<string, unknown>> {
  filters: TFilters
  onFiltersChange: (patch: Partial<TFilters>) => void
  config: TransactionFiltersConfig<TFilters>
}

export interface TransactionPaginationConfig {
  pageSize: number
}

interface TransactionContainerProps<
  TSchema extends TransactionSchema,
  TModel extends TransactionModel,
  TFilters extends Record<string, unknown> = Record<string, unknown>,
> {
  queryResult: UseQueryResult<TSchema[]> | UseInfiniteQueryResult<TSchema[], Error>
  modelBuilder: TransactionModelBuilder<TSchema, TModel>
  listComponent: ComponentType<TransactionListProps<TModel>>
  detailComponent?: ComponentType<TransactionDetailProps<TModel>>
  renderDetail?: (props: TransactionDetailModalProps<TModel>) => ReactNode
  filtersConfig?: TransactionFiltersConfig<TFilters>
  paginationConfig?: TransactionPaginationConfig
  renderFilters?: (props: TransactionFiltersRenderProps<TFilters>) => ReactNode
  filterFn?: (item: TModel, filters: TFilters) => boolean
  mode?: 'paged' | 'infinite'
}

export function TransactionContainer<
  TSchema extends TransactionSchema,
  TModel extends TransactionModel,
  TFilters extends Record<string, unknown>,
>(props: TransactionContainerProps<TSchema, TModel, TFilters>) {
  const {
    queryResult,
    modelBuilder,
    listComponent: ListComponent,
    detailComponent: DetailComponent,
    renderDetail,
    filtersConfig,
    paginationConfig,
    renderFilters,
    filterFn,
    mode = 'paged',
  } = props

  const initialFilters = filtersConfig?.initialState ?? ({} as TFilters)
  const [filters, setFilters] = useState<TFilters>(initialFilters)
  const [page, setPage] = useState(1)
  const [selectedId, setSelectedId] = useState<string>()
  const pageSize = paginationConfig?.pageSize ?? 10

  const isInfiniteQuery = isUseInfiniteQueryResult(queryResult) || mode === 'infinite'
  const infiniteQueryResult = isUseInfiniteQueryResult(queryResult) ? queryResult : undefined
  const infinitePages = infiniteQueryResult?.data?.pages
  const pagedData = !isInfiniteQuery ? (queryResult as UseQueryResult<TSchema[]>).data : undefined
  const listSource = useMemo(() => {
    if (infinitePages) {
      return infinitePages.flat()
    }
    return pagedData ?? []
  }, [infinitePages, pagedData])

  const models = useMemo(() => {
    const built = modelBuilder.buildList(listSource)
    if (filterFn && filtersConfig) {
      return built.filter((item) => filterFn(item, filters))
    }
    return built
  }, [filterFn, filters, filtersConfig, listSource, modelBuilder])

  const paginatedItems = useMemo(() => {
    if (isInfiniteQuery) {
      return models
    }
    const start = (page - 1) * pageSize
    return models.slice(start, start + pageSize)
  }, [isInfiniteQuery, models, page, pageSize])

  const selectedItem = useMemo(() => {
    return models.find((item) => item.id === selectedId)
  }, [models, selectedId])

  const handleFiltersChange = (patch: Partial<TFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch }))
    setPage(1)
  }

  const handleSelect = (item: TModel) => {
    setSelectedId(item.id)
  }

  const filtersNode =
    renderFilters && filtersConfig
      ? renderFilters({
          filters,
          onFiltersChange: handleFiltersChange,
          config: filtersConfig,
        })
      : null

  const listElement = (
    <ListComponent
      items={paginatedItems}
      isLoading={queryResult.isLoading}
      onSelect={handleSelect}
      selectedId={selectedId}
      pagination={
        !isInfiniteQuery
          ? {
              page,
              pageSize,
              totalItems: models.length,
              onPageChange: setPage,
            }
          : undefined
      }
      infinite={
        isInfiniteQuery && infiniteQueryResult
          ? {
              onLoadMore: () => infiniteQueryResult.fetchNextPage(),
              hasMore: Boolean(infiniteQueryResult.hasNextPage),
              isFetchingMore: infiniteQueryResult.isFetchingNextPage,
            }
          : undefined
      }
    />
  )

  const detailPanel =
    DetailComponent && !renderDetail ? (
      <DetailComponent item={selectedItem} isLoading={queryResult.isLoading} />
    ) : null

  return (
    <div className="flex flex-col gap-4">
      {filtersNode}
      {detailPanel ? (
        <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
          {listElement}
          {detailPanel}
        </div>
      ) : (
        listElement
      )}
      {renderDetail && (
        <>
          {renderDetail({
            item: selectedItem,
            isLoading: queryResult.isLoading,
            open: Boolean(selectedId),
            onClose: () => setSelectedId(undefined),
          })}
        </>
      )}
    </div>
  )
}

function isUseInfiniteQueryResult<TSchema extends TransactionSchema>(
  result: UseQueryResult<TSchema[]> | UseInfiniteQueryResult<TSchema[], Error>,
): result is UseInfiniteQueryResult<TSchema[], Error> {
  return 'fetchNextPage' in result
}
