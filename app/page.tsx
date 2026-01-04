import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, ShieldCheck, Zap, Globe, MessageSquare, Newspaper } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      {/* Hero Section */}
      <nav className="border-b bg-white/50 backdrop-blur-md sticky top-0 z-50 dark:bg-slate-900/50 dark:border-slate-800">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary rounded-lg p-1.5">
              <ShieldCheck className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">MedyaGem <span className="text-primary">CMS</span></span>
          </div>
          <Link href="/admin">
            <Button variant="ghost" className="font-medium">Panel Girişi</Button>
          </Link>
        </div>
      </nav>

      <main>
        <section className="py-20 lg:py-32 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 animate-pulse">
                <Zap className="w-4 h-4" />
                <span>Modern & Hızlı CMS Çözümü</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                İçeriğinizi <span className="text-primary">Profesyonelce</span> Yönetin
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                MedyaGem CMS ile sitelerinizi, hizmetlerinizi ve blog içeriklerinizi tek bir merkezden, SEO uyumlu ve hızlı bir şekilde yönetin.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/admin">
                  <Button size="lg" className="h-12 px-8 text-base gap-2 shadow-lg shadow-primary/20">
                    <LayoutDashboard className="w-5 h-5" />
                    Kontrol Paneline Git
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                  Dokümantasyonu Oku
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white dark:bg-slate-900 border-y dark:border-slate-800">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Globe className="w-10 h-10 text-blue-500" />}
                title="Çoklu Site Yönetimi"
                description="Tek panel üzerinden sınırsız web sitesini kolayca yönetin ve yayınlayın."
              />
              <FeatureCard
                icon={<Newspaper className="w-10 h-10 text-purple-500" />}
                title="SEO Odaklı Blog"
                description="Google uyumlu metataglar ve schema yapıları ile blog trafiğinizi artırın."
              />
              <FeatureCard
                icon={<MessageSquare className="w-10 h-10 text-emerald-500" />}
                title="Merkezi İletişim"
                description="Tüm sitelerinizden gelen formları tek bir yerden takip edin ve yanıtlayın."
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} MedyaGem. Tüm hakları saklıdır.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-2xl border bg-slate-50 dark:bg-slate-950 dark:border-slate-800 hover:shadow-xl transition-all duration-300 group">
      <div className="mb-6 transform transition-transform group-hover:scale-110 duration-300">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3 dark:text-white">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
