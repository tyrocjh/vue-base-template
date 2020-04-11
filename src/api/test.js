import request from '@/utils/request'

export function getArticleList(data) {
  return request({
    url: '/cms/news/list',
    method: 'GET',
    data
  })
}
