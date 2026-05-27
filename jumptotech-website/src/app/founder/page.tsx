"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import Image from "next/image";

export default function FounderPage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-24 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1 space-y-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)]">
              {t("Meet the Founder", "Познакомьтесь с основателем")}
            </h1>
            <div className="w-20 h-1 bg-[#185FA5] mt-4 rounded-full" />
          </div>

          <div className="space-y-4 text-[var(--muted)] leading-relaxed text-base sm:text-lg">
            <p>
              {t(
                "Welcome to JumpToTech DevOps School!",
                "Добро пожаловать в JumpToTech DevOps School!"
              )}
            </p>
            <p>
              {t(
                "My name is Aisalkyn Aidarova — founder of JumpToTech, Senior DevOps Engineer, researcher, and PhD candidate.",
                "Меня зовут Айсалкын Айдарова — основатель JumpToTech, Senior DevOps Engineer, исследователь и кандидат PhD."
              )}
            </p>
            <p>
              {t(
                "I earned my Associate Degree in Computer Science from Wilbur Wright College and completed both my Bachelor’s and Master’s degrees at Northeastern Illinois University (NEIU). Currently, I continue my academic and research journey as a PhD candidate while actively working in the technology industry.",
                "Я получила Associate Degree в области Computer Science в Wilbur Wright College, а также Bachelor’s и Master’s degree в Northeastern Illinois University (NEIU). В настоящее время я продолжаю научную деятельность как кандидат PhD и одновременно работаю в сфере технологий."
              )}
            </p>
            <p>
              {t(
                "My professional journey in IT started at MHC, where I worked as a QA Engineer and gained hands-on experience with enterprise systems, automation testing, cloud technologies, CI/CD pipelines, infrastructure environments, and production-level applications. Through continuous learning and real-world experience, I successfully transitioned from QA Engineering into DevOps and Cloud Engineering.",
                "Мой профессиональный путь в IT начался в компании MHC, где я работала QA Engineer и получила практический опыт работы с enterprise-системами, automation testing, cloud технологиями, CI/CD pipeline, инфраструктурой и production-приложениями. Благодаря постоянному обучению и практическому опыту я успешно перешла из QA Engineering в DevOps и Cloud Engineering."
              )}
            </p>
            <p>
              {t(
                "Over the years, I have built practical experience working with AWS, Kubernetes, Docker, Terraform, Linux, automation, monitoring, CI/CD, and cloud infrastructure technologies used in real production environments.",
                "За годы работы я получила практический опыт работы с AWS, Kubernetes, Docker, Terraform, Linux, automation, monitoring, CI/CD и cloud инфраструктурой, используемой в реальных production environment."
              )}
            </p>
            <p>
              {t(
                "JumpToTech was created to help students gain practical, job-ready skills that companies actually require today. Our focus is not only theory — students work with real projects, real tools, and production-style environments designed to prepare them for real careers in technology.",
                "JumpToTech был создан, чтобы помогать студентам получать реальные, востребованные навыки, необходимые современным компаниям. Мы делаем упор не только на теорию — студенты работают с настоящими проектами, инструментами и production-подобными environment, которые готовят их к реальной карьере в технологиях."
              )}
            </p>
            <p>
              {t(
                "Whether you are changing careers, starting from zero, or advancing your current IT skills, our mission is to help you confidently build a successful future in tech.",
                "Независимо от того, меняете ли вы профессию, начинаете с нуля или хотите развивать свои IT-навыки, наша цель — помочь вам уверенно построить успешное будущее в сфере технологий."
              )}
            </p>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <div className="relative h-[500px] w-full rounded-2xl overflow-hidden border-4 border-[#185FA5]/20 shadow-xl">
            <Image
              src="/founder.png"
              alt="Aisalkyn Aidarova"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8">
              <p className="text-white font-bold text-2xl mb-1">Aisalkyn Aidarova</p>
              <p className="text-[#1D9E75] font-medium text-lg">Founder & Lead Instructor</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
