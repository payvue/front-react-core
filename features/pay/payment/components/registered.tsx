import { useEffect, useState } from "react"
import { CheckCircle2, Plus } from "lucide-react"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'


// 임시 카드 데이터
const registeredCards = [
  {
    id: "card1",
    bank: "신한카드",
    number: "**** **** **** 1234",
    type: "신용카드"
  },
  {
    id: "card2",
    bank: "국민은행",
    number: "110-***-******",
    type: "계좌이체"
  },
]

interface RegisteredPaymentMethodProps {
  selectedCard: string | null
  onCardSelect: (cardId: string | null) => void
  disabled?: boolean
}

export default function RegisteredPaymentMethod({ 
  selectedCard, 
  onCardSelect, 
  disabled = false 
}: RegisteredPaymentMethodProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [swiperInstance, setSwiperInstance] = useState<any>(null)

  // 부모 컴포넌트에서 selectedCard가 변경되면 swiper 동기화
  useEffect(() => {
    if (selectedCard && swiperInstance) {
      const index = registeredCards.findIndex(card => card.id === selectedCard)
      if (index !== -1 && index !== currentIndex) {
        swiperInstance.slideTo(index, 600) // 애니메이션 속도 지정
      }
    }
  }, [selectedCard, swiperInstance, currentIndex])

  const handleCardClick = (cardId: string, index: number) => {
    if (disabled) return
    
    setCurrentIndex(index)
    if (swiperInstance) {
      swiperInstance.slideTo(index, 600) // 부드러운 애니메이션
    }
    // 이미 선택된 카드를 다시 클릭하면 선택 해제
    if (selectedCard === cardId) {
      onCardSelect(null)
    } else {
      onCardSelect(cardId)
    }
  }

  const handleAddCard = () => {
    if (disabled) return
    alert("카드 추가 기능이 실행됩니다!")
  }

  const handleSlideChange = (swiper: any) => {
    setCurrentIndex(swiper.activeIndex)
  }

  return (
    <div className="w-full max-w-full overflow-hidden">
      {/* Swiper 카드 슬라이더 */}
      <div className="relative w-full">
        <Swiper
          modules={[Pagination]}
          onSwiper={setSwiperInstance}
          onSlideChange={handleSlideChange}
          grabCursor={!disabled}
          centeredSlides={false}
          slidesPerView="auto"
          spaceBetween={16}
          slidesOffsetBefore={10}
          pagination={{
            clickable: !disabled,
            dynamicBullets: true,
          }}
          speed={600}
          resistance={true}
          resistanceRatio={0.85}
          allowTouchMove={!disabled}
          freeMode={false}
          watchSlidesProgress={true}
          watchOverflow={true}
          className="pb-12 !overflow-visible"
          style={{ 
            maxWidth: '80%',
            overflow: 'hidden'
          }}
        >
          {/* 등록된 카드들 */}
          {registeredCards.map((card, index) => (
            <SwiperSlide key={card.id} className="!w-64 !h-auto" style={{ width: "fit-content" }}>
              <div
                onClick={() => handleCardClick(card.id, index)}
                className={`transition-all duration-500 ease-out ${
                  disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                } ${
                  selectedCard === card.id 
                    ? "scale-105" 
                    : currentIndex === index 
                    ? "scale-100" 
                    : "scale-95 opacity-80"
                }`}
              >
                <div className={`relative h-40 rounded-2xl p-5 shadow-lg transition-all duration-500 ease-out select-none ${
                  selectedCard === card.id
                    ? "bg-gradient-to-br from-blue-500 to-blue-700 ring-4 ring-blue-400 ring-offset-2 shadow-xl"
                    : "bg-gradient-to-br from-gray-700 to-gray-900 hover:shadow-xl hover:scale-[1.02]"
                }`}             
                >
                  {/* 카드 배경 패턴 */}
                    <div className="absolute inset-0 opacity-10 overflow-hidden rounded-2xl">                                        
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
                    </div>

                  
                  {/* 카드 내용 */}
                  <div className="relative h-full flex flex-col justify-between text-white">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-xs opacity-80 mb-1">{card.type}</div>
                        <div className="font-bold text-lg">{card.bank}</div>
                      </div>
                      {selectedCard === card.id && (
                        <CheckCircle2 className="w-6 h-6 text-white animate-in zoom-in duration-200" />
                      )}
                    </div>
                    
                    <div>
                      <div className="text-lg font-mono tracking-wider mb-2">
                        {card.number}
                      </div>
                    </div>
                  </div>


                </div>
              </div>
            </SwiperSlide>
          ))}

          {/* 카드 추가 버튼 */}
          <SwiperSlide className="!w-64 flex-shrink-0 !h-auto">
            <div
              onClick={handleAddCard}
              className={`transition-all duration-500 ease-out ${
                disabled 
                  ? 'cursor-not-allowed opacity-50' 
                  : 'hover:scale-105 cursor-pointer'
              } ${
                currentIndex === registeredCards.length
                  ? "scale-100"
                  : "scale-95 opacity-80"
              }`}
            >
              <div className="relative h-40 rounded-2xl p-5 border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-500 ease-out select-none">
                <div className="h-full flex flex-col items-center justify-center text-gray-400 hover:text-blue-500 transition-colors">
                  <div className="w-16 h-16 rounded-full bg-gray-100 hover:bg-blue-100 flex items-center justify-center mb-3 transition-colors">
                    <Plus className="w-8 h-8" />
                  </div>
                  <div className="font-semibold text-lg">새 카드 추가</div>
                  <div className="text-sm mt-1">간편하게 등록하세요</div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      {/* 선택된 카드 정보 */}
      {selectedCard && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center gap-2 text-blue-700">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-semibold">
              {registeredCards.find(c => c.id === selectedCard)?.bank} 선택됨
            </span>
          </div>
        </div>
      )}

      {/* Swiper 페이지네이션 커스텀 스타일 */}
      <style>{`
        .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #d1d5db;
          opacity: 1;
          transition: all 0.3s ease;
        }
        .swiper-pagination-bullet-active {
          width: 32px;
          border-radius: 4px;
          background: #2563eb;
        }
        .swiper-slide {
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), 
                      opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .swiper-wrapper {
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
        /* 부모 컨테이너 넘침 방지 */
        .swiper, .swiper-container {
          width: 100%;
          overflow: hidden !important;
          max-width: 100%;
        }
        .swiper-slide-prev,
        .swiper-slide-next {
          opacity: 0.6;
          transform: scale(0.95);
        }
        .swiper-slide-active {
          opacity: 1;
          transform: scale(1);
          z-index: 10;
        }
      `}</style>
    </div>       
  )
}
