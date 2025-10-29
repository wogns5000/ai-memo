'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Memo, MemoFormData } from '@/types/memo'
import {
  getMemos as getMemosAction,
  createMemo as createMemoAction,
  updateMemo as updateMemoAction,
  deleteMemo as deleteMemoAction,
  clearAllMemos as clearAllMemosAction,
} from '@/app/actions/memo-actions'

export const useMemos = () => {
  const [memos, setMemos] = useState<Memo[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // 메모 로드 함수
  const loadMemos = useCallback(async () => {
    setLoading(true)
    try {
      const loadedMemos = await getMemosAction()
      setMemos(loadedMemos)
    } catch (error) {
      console.error('Failed to load memos:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // 메모 로드
  useEffect(() => {
    loadMemos()
  }, [loadMemos])

  // 메모 생성
  const createMemo = useCallback(
    async (formData: MemoFormData): Promise<Memo> => {
      try {
        const newMemo = await createMemoAction(formData)
        // 낙관적 업데이트
        setMemos(prev => [newMemo, ...prev])
        return newMemo
      } catch (error) {
        console.error('Failed to create memo:', error)
        // 실패 시 메모 목록 다시 로드
        await loadMemos()
        throw error
      }
    },
    [loadMemos]
  )

  // 메모 업데이트
  const updateMemo = useCallback(
    async (id: string, formData: MemoFormData): Promise<void> => {
      try {
        const updatedMemo = await updateMemoAction(id, formData)
        // 낙관적 업데이트
        setMemos(prev => prev.map(memo => (memo.id === id ? updatedMemo : memo)))
      } catch (error) {
        console.error('Failed to update memo:', error)
        // 실패 시 메모 목록 다시 로드
        await loadMemos()
        throw error
      }
    },
    [loadMemos]
  )

  // 메모 삭제
  const deleteMemo = useCallback(
    async (id: string): Promise<void> => {
      try {
        await deleteMemoAction(id)
        // 낙관적 업데이트
        setMemos(prev => prev.filter(memo => memo.id !== id))
      } catch (error) {
        console.error('Failed to delete memo:', error)
        // 실패 시 메모 목록 다시 로드
        await loadMemos()
        throw error
      }
    },
    [loadMemos]
  )

  // 메모 검색
  const searchMemos = useCallback((query: string): void => {
    setSearchQuery(query)
  }, [])

  // 카테고리 필터링
  const filterByCategory = useCallback((category: string): void => {
    setSelectedCategory(category)
  }, [])

  // 특정 메모 가져오기
  const getMemoById = useCallback(
    (id: string): Memo | undefined => {
      return memos.find(memo => memo.id === id)
    },
    [memos]
  )

  // 필터링된 메모 목록
  const filteredMemos = useMemo(() => {
    let filtered = memos

    // 카테고리 필터링
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(memo => memo.category === selectedCategory)
    }

    // 검색 필터링
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        memo =>
          memo.title.toLowerCase().includes(query) ||
          memo.content.toLowerCase().includes(query) ||
          memo.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    return filtered
  }, [memos, selectedCategory, searchQuery])

  // 모든 메모 삭제
  const clearAllMemos = useCallback(async (): Promise<void> => {
    try {
      await clearAllMemosAction()
      setMemos([])
      setSearchQuery('')
      setSelectedCategory('all')
    } catch (error) {
      console.error('Failed to clear all memos:', error)
      throw error
    }
  }, [])

  // 통계 정보
  const stats = useMemo(() => {
    const totalMemos = memos.length
    const categoryCounts = memos.reduce(
      (acc, memo) => {
        acc[memo.category] = (acc[memo.category] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    return {
      total: totalMemos,
      byCategory: categoryCounts,
      filtered: filteredMemos.length,
    }
  }, [memos, filteredMemos])

  return {
    // 상태
    memos: filteredMemos,
    allMemos: memos,
    loading,
    searchQuery,
    selectedCategory,
    stats,

    // 메모 CRUD
    createMemo,
    updateMemo,
    deleteMemo,
    getMemoById,

    // 필터링 & 검색
    searchMemos,
    filterByCategory,

    // 유틸리티
    clearAllMemos,
  }
}
