export interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  duration: string;
  timestamp: string;
  pagination?: PaginationMeta; // ✅ optional field
}


export const calculateDuration = (startTime: number): string => {
  const endTime = Date.now();
  const durationMs = endTime - startTime;


  if (durationMs < 1000) {
    return `${durationMs} มิลลิวินาที`;
  } else if (durationMs < 60000) {
    const seconds = Math.floor(durationMs / 1000);
    return `${seconds} วินาที`;
  } else if (durationMs < 3600000) {
    const minutes = Math.floor(durationMs / 60000);
    return `${minutes} นาที`;
  } else {
    const hours = Math.floor(durationMs / 3600000);
    return `${hours} ชั่วโมง`;
  }
};


