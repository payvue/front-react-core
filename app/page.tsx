import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Zap, Users, CreditCard, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#faf7ff" }}>
      {/* Hero Section */}
      <section
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #faf7ff 0%, #f3e8ff 50%, #e9d5ff 100%)" }}
      >
        <div className="container mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6">
              <span style={{ color: "#7c3aed" }}>PayEasy</span>로 시작하는
              <br />
              <span style={{ color: "#581c87" }}>스마트한 간편결제</span>
            </h1>
            <p className="text-xl text-balance mb-8" style={{ color: "#6b46c1" }}>
              안전하고 빠른 온라인 결제, 그룹 계정으로 함께 관리하는 새로운 경험을 만나보세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="text-lg px-8 text-white hover:opacity-90"
                style={{ backgroundColor: "#7c3aed" }}
              >
                <Link href="/register">
                  지금 시작하기
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-lg px-8 bg-transparent hover:bg-purple-50"
                style={{ borderColor: "#7c3aed", color: "#7c3aed" }}
              >
                <Link href="/login">로그인</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#581c87" }}>
              왜 PayEasy를 선택해야 할까요?
            </h2>
            <p className="text-xl" style={{ color: "#6b46c1" }}>
              혁신적인 기능으로 더 나은 결제 경험을 제공합니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center border-purple-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto p-3 rounded-full w-fit mb-4" style={{ backgroundColor: "#e9d5ff" }}>
                  <Shield className="h-8 w-8" style={{ color: "#7c3aed" }} />
                </div>
                <CardTitle style={{ color: "#581c87" }}>보안 우선</CardTitle>
                <CardDescription style={{ color: "#6b46c1" }}>
                  최고 수준의 보안 기술로 안전한 거래를 보장합니다
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center border-purple-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto p-3 rounded-full w-fit mb-4" style={{ backgroundColor: "#e9d5ff" }}>
                  <Zap className="h-8 w-8" style={{ color: "#7c3aed" }} />
                </div>
                <CardTitle style={{ color: "#581c87" }}>빠른 결제</CardTitle>
                <CardDescription style={{ color: "#6b46c1" }}>원클릭으로 완료되는 초고속 결제 시스템</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center border-purple-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto p-3 rounded-full w-fit mb-4" style={{ backgroundColor: "#e9d5ff" }}>
                  <Users className="h-8 w-8" style={{ color: "#7c3aed" }} />
                </div>
                <CardTitle style={{ color: "#581c87" }}>그룹 관리</CardTitle>
                <CardDescription style={{ color: "#6b46c1" }}>
                  친구, 가족과 함께 결제 내역과 잔액을 공유하세요
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center border-purple-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto p-3 rounded-full w-fit mb-4" style={{ backgroundColor: "#e9d5ff" }}>
                  <CreditCard className="h-8 w-8" style={{ color: "#7c3aed" }} />
                </div>
                <CardTitle style={{ color: "#581c87" }}>다양한 결제수단</CardTitle>
                <CardDescription style={{ color: "#6b46c1" }}>
                  카드, 계좌, 간편결제까지 모든 결제수단 지원
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={{ backgroundColor: "#f3e8ff" }}>
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#581c87" }}>
            지금 바로 PayEasy를 시작하세요
          </h2>
          <p className="text-xl mb-8" style={{ color: "#6b46c1" }}>
            무료 회원가입으로 모든 기능을 이용해보세요
          </p>
          <Button
            asChild
            size="lg"
            className="text-lg px-8 text-white hover:opacity-90"
            style={{ backgroundColor: "#7c3aed" }}
          >
            <Link href="/register">
              무료로 시작하기
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
