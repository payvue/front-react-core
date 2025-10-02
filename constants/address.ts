export const cityOptions = [
  { value: "서울특별시", label: "서울특별시" },
  { value: "경기도", label: "경기도" },
  { value: "부산광역시", label: "부산광역시" },
]

export const districtMap: Record<string, { value: string; label: string }[]> = {
  "서울특별시": [
    { value: "강남구", label: "강남구" },
    { value: "송파구", label: "송파구" },
    { value: "중구", label: "중구" },
  ],
  "경기도": [
    { value: "수원시", label: "수원시" },
    { value: "성남시", label: "성남시" },
    { value: "용인시", label: "용인시" },
  ],
}