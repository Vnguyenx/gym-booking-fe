// store/hooks.ts
// Tạo 2 hook tùy chỉnh có sẵn kiểu TypeScript
// Thay vì import useDispatch/useSelector từ react-redux mỗi lần,
// chỉ cần import 2 hook này là đủ, vừa gọn vừa an toàn kiểu dữ liệu

import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// useAppDispatch: dùng để gửi action thay đổi state
// Ví dụ: const dispatch = useAppDispatch()
//        dispatch(setUser(userData))
export const useAppDispatch = () => useDispatch<AppDispatch>();

// useAppSelector: dùng để đọc dữ liệu từ store
// Ví dụ: const user = useAppSelector((state) => state.auth.user)
export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
    useSelector(selector);