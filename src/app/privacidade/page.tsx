import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade — Zaia",
  description: "Política de privacidade da plataforma Zaia",
};

export default function PrivacidadePage() {
  const updated = "17 de junho de 2026";
  const email = "contato@zaia.app";

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight mb-3">Política de Privacidade</h1>
          <p className="text-white/40 text-sm">Última atualização: {updated}</p>
        </div>

        <div className="space-y-10 text-white/70 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">1. Quem somos</h2>
            <p>
              A <strong className="text-white">Zaia</strong> é uma plataforma de atendimento automatizado
              via WhatsApp com inteligência artificial. Ao usar nossos serviços, você concorda com as
              práticas descritas nesta política.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">2. Dados que coletamos</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Nome e e-mail fornecidos no cadastro</li>
              <li>Número de telefone e nome de contatos do WhatsApp que interagem com seus agentes</li>
              <li>Conteúdo das mensagens trocadas entre seus agentes e os usuários finais</li>
              <li>Dados de uso da plataforma (páginas acessadas, funcionalidades utilizadas)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">3. Como usamos os dados</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Para operar e melhorar a plataforma</li>
              <li>Para gerar respostas automáticas via inteligência artificial</li>
              <li>Para exibir o histórico de conversas no painel do cliente</li>
              <li>Para enviar notificações relacionadas à sua conta (quando necessário)</li>
            </ul>
            <p className="mt-3">
              Não vendemos seus dados a terceiros. Não utilizamos mensagens de usuários finais para
              treinar modelos de IA sem consentimento explícito.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">4. Compartilhamento com terceiros</h2>
            <p>Utilizamos os seguintes serviços para operar a plataforma:</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li><strong className="text-white">Meta (WhatsApp Cloud API)</strong> — para envio e recebimento de mensagens</li>
              <li><strong className="text-white">Anthropic</strong> — para processamento de linguagem natural e geração de respostas</li>
              <li><strong className="text-white">Clerk</strong> — para autenticação de usuários</li>
              <li><strong className="text-white">Neon / PostgreSQL</strong> — para armazenamento de dados</li>
              <li><strong className="text-white">Vercel</strong> — para hospedagem da aplicação</li>
            </ul>
            <p className="mt-3">Cada um desses serviços possui sua própria política de privacidade.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">5. Retenção de dados</h2>
            <p>
              Mantemos os dados enquanto sua conta estiver ativa. Você pode solicitar a exclusão
              de seus dados a qualquer momento pelo e-mail abaixo. Conversas do WhatsApp são
              retidas para fins de histórico e podem ser excluídas pela plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">6. Segurança</h2>
            <p>
              Utilizamos criptografia em trânsito (HTTPS/TLS) e tokens de acesso protegidos.
              Senhas e tokens nunca são exibidos em texto claro. Assinaturas HMAC verificam
              a autenticidade das mensagens recebidas da Meta.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">7. Seus direitos</h2>
            <p>Você tem direito a:</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>Acessar os dados que temos sobre você</li>
              <li>Corrigir informações incorretas</li>
              <li>Solicitar a exclusão da sua conta e dados associados</li>
              <li>Portabilidade dos seus dados (mediante solicitação)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">8. Cookies</h2>
            <p>
              Utilizamos cookies essenciais para autenticação e funcionamento da plataforma.
              Não utilizamos cookies de rastreamento ou publicidade.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">9. Contato</h2>
            <p>
              Para dúvidas, solicitações de exclusão ou qualquer questão relacionada à
              privacidade, entre em contato:
            </p>
            <p className="mt-2">
              <a
                href={`mailto:${email}`}
                className="text-violet-400 hover:text-violet-300 transition-colors"
              >
                {email}
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">10. Alterações nesta política</h2>
            <p>
              Podemos atualizar esta política periodicamente. Notificaremos usuários sobre
              mudanças significativas por e-mail ou aviso na plataforma.
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 text-center">
          <p className="text-white/25 text-sm">© 2026 Zaia. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
}
