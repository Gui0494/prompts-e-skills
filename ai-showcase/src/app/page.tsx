"use client";

import dynamic from "next/dynamic";

const SplineScene = dynamic(() => import("@/components/SplineScene"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-300 to-gray-600 flex items-center justify-center">
              <span className="text-black font-bold text-sm">AI</span>
            </div>
            <span className="font-semibold text-white text-lg tracking-tight">
              CLI Agent
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">
              Recursos
            </a>
            <a href="#demo" className="hover:text-white transition-colors">
              Demo
            </a>
            <a href="#start" className="hover:text-white transition-colors">
              Começar
            </a>
          </div>
          <a
            href="#start"
            className="px-4 py-2 text-sm font-medium rounded-lg bg-white text-black hover:bg-gray-200 transition-colors"
          >
            Get Started
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Spline 3D Background */}
        <div className="absolute inset-0 z-0">
          <SplineScene />
        </div>

        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 z-[1] h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent" />

        {/* Hero Content */}
        <div className="relative z-[2] max-w-7xl mx-auto px-6 pt-20">
          <div className="max-w-2xl">
            <div className="animate-fade-in-up">
              <span className="inline-block px-3 py-1 text-xs font-mono text-gray-400 border border-gray-700 rounded-full mb-6 bg-white/5">
                v2.0 — Powered by AI
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] tracking-tight animate-fade-in-up-delay-1">
              Inteligência
              <br />
              <span className="bg-gradient-to-r from-gray-100 to-gray-500 bg-clip-text text-transparent">
                Artificial
              </span>
              <br />
              no seu Terminal
            </h1>

            <p className="mt-6 text-lg text-gray-400 max-w-lg leading-relaxed animate-fade-in-up-delay-2">
              Um agente CLI inteligente que entende seu código, automatiza
              tarefas complexas e acelera seu fluxo de trabalho com o poder da
              IA generativa.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 animate-fade-in-up-delay-3">
              <a
                href="#start"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-lg bg-white text-black hover:bg-gray-200 transition-all hover:scale-105"
              >
                Começar Agora
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </a>
              <a
                href="#demo"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-lg border border-gray-700 text-gray-300 hover:bg-white/5 transition-all"
              >
                Ver Demo
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a]" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
              Recursos{" "}
              <span className="bg-gradient-to-r from-gray-300 to-gray-600 bg-clip-text text-transparent">
                Poderosos
              </span>
            </h2>
            <p className="mt-4 text-gray-500 text-lg max-w-2xl mx-auto">
              Tudo o que você precisa para automatizar e potencializar seu
              desenvolvimento.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                ),
                title: "Ultra Rápido",
                desc: "Respostas em milissegundos. Processa comandos complexos instantaneamente.",
              },
              {
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                ),
                title: "Código Inteligente",
                desc: "Entende contexto do projeto e gera código limpo e funcional.",
              },
              {
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                ),
                title: "Automação Total",
                desc: "Automatize deploys, testes, refatoração e tarefas repetitivas.",
              },
              {
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                ),
                title: "Seguro",
                desc: "Execução isolada com permissões granulares e auditoria completa.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-white group-hover:bg-white/10 transition-all">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Terminal Demo Section */}
      <section id="demo" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
              Veja em{" "}
              <span className="bg-gradient-to-r from-gray-300 to-gray-600 bg-clip-text text-transparent">
                Ação
              </span>
            </h2>
            <p className="mt-4 text-gray-500 text-lg">
              Uma demonstração do poder do AI CLI Agent.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="rounded-2xl border border-white/10 bg-[#111111] overflow-hidden shadow-2xl shadow-black/50">
              {/* Terminal Header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-[#1a1a1a] border-b border-white/5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                <span className="ml-3 text-xs text-gray-500 font-mono">
                  ai-agent — bash
                </span>
              </div>

              {/* Terminal Body */}
              <div className="p-6 font-mono text-sm space-y-3">
                <div className="terminal-line">
                  <span className="text-gray-500">$</span>{" "}
                  <span className="text-white">ai-agent</span>{" "}
                  <span className="text-gray-400">
                    &quot;analise este projeto e sugira melhorias&quot;
                  </span>
                </div>
                <div className="terminal-line">
                  <span className="text-gray-600">
                    ▸ Escaneando estrutura do projeto...
                  </span>
                </div>
                <div className="terminal-line">
                  <span className="text-gray-600">
                    ▸ Analisando 47 arquivos em 12 diretórios...
                  </span>
                </div>
                <div className="terminal-line">
                  <span className="text-gray-600">
                    ▸ Identificando padrões e anti-patterns...
                  </span>
                </div>
                <div className="terminal-line text-green-400/80">
                  ✓ Análise completa. 8 sugestões encontradas.
                </div>
                <div className="terminal-line mt-4">
                  <span className="text-gray-500">$</span>{" "}
                  <span className="text-white">ai-agent</span>{" "}
                  <span className="text-gray-400">
                    &quot;aplique a sugestão #1&quot;
                  </span>
                </div>
                <div className="terminal-line text-green-400/80">
                  ✓ Refatoração aplicada em 3 arquivos.{" "}
                  <span className="text-gray-500">Nenhum teste quebrado.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="start" className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#111] to-[#0a0a0a]" />
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Pronto para
            <br />
            <span className="bg-gradient-to-r from-gray-100 to-gray-500 bg-clip-text text-transparent">
              transformar
            </span>{" "}
            seu workflow?
          </h2>
          <p className="mt-6 text-gray-500 text-lg max-w-xl mx-auto">
            Instale o AI CLI Agent e comece a automatizar tarefas com
            inteligência artificial em segundos.
          </p>

          {/* Install Command */}
          <div className="mt-10 max-w-md mx-auto">
            <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-[#111] border border-white/10 font-mono text-sm">
              <span className="text-gray-500">$</span>
              <span className="text-white">npm install -g ai-cli-agent</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#"
              className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-medium rounded-lg bg-white text-black hover:bg-gray-200 transition-all hover:scale-105"
            >
              Documentação
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-medium rounded-lg border border-gray-700 text-gray-300 hover:bg-white/5 transition-all"
            >
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-gray-300 to-gray-600 flex items-center justify-center">
              <span className="text-black font-bold text-[10px]">AI</span>
            </div>
            <span className="text-sm text-gray-500">
              AI CLI Agent © 2026
            </span>
          </div>
          <div className="flex gap-6 text-sm text-gray-600">
            <a href="#" className="hover:text-gray-300 transition-colors">
              Privacidade
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              Termos
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              Contato
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
