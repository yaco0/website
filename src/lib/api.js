import { supabase } from './supabase';

// 결혼식 정보 가져오기
export async function getWedding(userId) {
  const { data, error } = await supabase
    .from('weddings')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) throw error;
  return data;
}

// 결혼식 정보 생성 또는 업데이트
export async function saveWedding(weddingData) {
  const { data, error } = await supabase
    .from('weddings')
    .upsert(weddingData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// 식순 항목 가져오기
export async function getScheduleItems(weddingId) {
  const { data, error } = await supabase
    .from('schedule_items')
    .select('*')
    .eq('wedding_id', weddingId)
    .order('order_number');
  
  if (error) throw error;
  return data;
}

// 식순 항목 생성 또는 업데이트
export async function saveScheduleItem(item) {
  const { data, error } = await supabase
    .from('schedule_items')
    .upsert(item)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// 식순 항목 삭제
export async function deleteScheduleItem(itemId) {
  const { error } = await supabase
    .from('schedule_items')
    .delete()
    .eq('id', itemId);
  
  if (error) throw error;
  return true;
}

// 여러 식순 항목 업데이트 (순서 변경 시 사용)
export async function updateScheduleItemsOrder(items) {
  const { data, error } = await supabase
    .from('schedule_items')
    .upsert(items);
  
  if (error) throw error;
  return data;
}

// 모든 일정 가져오기
export async function getSchedules(userId) {
  const { data, error } = await supabase
    .from('schedules')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: true });
    
  if (error) {
    throw error;
  }
  
  return data;
}

// 일정 추가하기
export async function addSchedule(newSchedule) {
  const { data, error } = await supabase
    .from('schedules')
    .insert([newSchedule])
    .select();
    
  if (error) {
    throw error;
  }
  
  return data[0];
}

// 일정 수정하기
export async function updateSchedule(id, updatedSchedule) {
  const { data, error } = await supabase
    .from('schedules')
    .update(updatedSchedule)
    .eq('id', id)
    .select();
    
  if (error) {
    throw error;
  }
  
  return data[0];
}

// 일정 삭제하기
export async function deleteSchedule(id) {
  const { error } = await supabase
    .from('schedules')
    .delete()
    .eq('id', id);
    
  if (error) {
    throw error;
  }
  
  return true;
} 