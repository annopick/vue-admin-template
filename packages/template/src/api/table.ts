import request, { type ApiResponse } from '@/utils/request'

export interface TableItem {
  id: number
  title: string
  author: string
  reviewer: string
  status: string
  importance: number
  pageviews: number
  display_time: string
}

export interface TableListResponse {
  items: TableItem[]
  total: number
}

export function getList(params: { page: number; limit: number }): Promise<ApiResponse<TableListResponse>> {
  return request({
    url: '/table/list',
    method: 'get',
    params,
  }) as unknown as Promise<ApiResponse<TableListResponse>>
}
