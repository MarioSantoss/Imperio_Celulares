import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowDownLeft,
    ArrowUpRight,
    Boxes,
    ChevronRight,
    CircleAlert,
    PackagePlus,
    Plus,
    Search,
    ClipboardCheck,
    Wallet,
} from 'lucide-react';
import { dashboard } from '@/routes';
import { index as productsIndex, create as productsCreate } from '@/routes/products';
import { index as movementsIndex } from '@/routes/movements';
import { index as repairsIndex, create as repairsCreate } from '@/routes/repairs';
import { index as cashIndex } from '@/routes/cash';
import type { RouteDefinition } from '@/wayfinder';

type Metrics = { totalProducts: number; totalStock: number; lowStock: number; entriesToday: number; exitsToday: number; repairsToday: number; repairRevenueToday: string; readyRepairs: number; cashBalance: string };
type RecentMovement = { id: number; type: 'Entrada' | 'Saída'; quantity: number; reason: string; created_at: string; product: { name: string } };
type WeeklyMovement = { label: string; entries: number; exits: number };

export default function Dashboard({ metrics, recentMovements, weeklyMovement }: { metrics: Metrics; recentMovements: RecentMovement[]; weeklyMovement: WeeklyMovement[] }) {
    const { auth } = usePage().props;
    const canManageProducts = auth.user?.role === 'gerente' || auth.user?.role === 'proprietario';
    const activity = recentMovements.map((movement) => ({
        icon: movement.type === 'Entrada' ? PackagePlus : ArrowUpRight,
        title: `${movement.type} registrada`,
        description: `${movement.quantity} unidade(s) de ${movement.product.name}: ${movement.reason}.`,
        time: new Date(movement.created_at).toLocaleString('pt-BR'),
        tone: movement.type === 'Entrada' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600',
    }));
    return (
        <>
            <Head title="Visão geral" />
            <div className="min-h-full bg-[#f7f8fa] p-4 sm:p-6 lg:p-8">
                <div className="mx-auto flex max-w-7xl flex-col gap-7">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                        <div>
                            <p className="text-sm font-medium text-[#e2613f]">Quinta-feira, 10 de setembro</p>
                            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#17212b]">Visão geral</h1>
                            <p className="mt-1 text-sm text-[#71808e]">Métricas e atividades atualizadas do seu estoque.</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Link href={productsIndex()} className="inline-flex min-w-0 flex-1 items-center justify-center gap-2 rounded-lg border border-[#dfe4e8] bg-white px-3 py-2.5 text-sm font-semibold text-[#34414d] shadow-sm transition hover:border-[#e2613f] hover:text-[#e2613f] sm:flex-none sm:px-4"><Search className="size-4" />Consultar produtos</Link>
                            {canManageProducts && <Link href={productsCreate()} className="inline-flex min-w-0 flex-1 items-center justify-center gap-2 rounded-lg bg-[#e2613f] px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#c95031] sm:flex-none sm:px-4"><Plus className="size-4" />Novo produto</Link>}
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <MetricCard label="Unidades em estoque" value={metrics.totalStock.toLocaleString('pt-BR')} detail={`${metrics.totalProducts} produtos cadastrados`} icon={Boxes} tone="orange" />
                        <MetricCard label="Estoque baixo" value={metrics.lowStock.toLocaleString('pt-BR')} detail="Itens requerem atenção" icon={CircleAlert} tone="amber" />
                        <MetricCard label="Entradas hoje" value={metrics.entriesToday.toLocaleString('pt-BR')} detail="Unidades recebidas" icon={ArrowDownLeft} tone="green" />
                        <MetricCard label="Saídas hoje" value={metrics.exitsToday.toLocaleString('pt-BR')} detail="Unidades despachadas" icon={ArrowUpRight} tone="blue" />
                        <MetricCard label="Assistências hoje" value={metrics.repairsToday.toLocaleString('pt-BR')} detail={`${metrics.readyRepairs} prontas para entrega`} icon={ClipboardCheck} tone="orange" />
                        <MetricCard label="Serviços hoje" value={`R$ ${Number(metrics.repairRevenueToday).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} detail="Valor de assistências" icon={Wallet} tone="green" />
                        <MetricCard label="Saldo em caixa" value={`R$ ${Number(metrics.cashBalance).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} detail="Entradas menos saídas" icon={Wallet} tone="blue" />
                    </div>

                    <div className="grid gap-5 xl:grid-cols-[1.35fr_1fr]">
                        <section className="rounded-xl border border-[#e5e8eb] bg-white p-5 shadow-sm sm:p-6">
                            <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-semibold text-[#17212b]">Movimentação semanal</h2><p className="mt-1 text-sm text-[#71808e]">Entradas e saídas nos últimos 7 dias</p></div><button className="rounded-lg border border-[#dfe4e8] px-3 py-2 text-xs font-semibold text-[#586675] transition hover:border-[#e2613f] hover:text-[#e2613f]">Exportar relatório</button></div>
                            <div className="mt-7 flex h-52 items-end gap-2 border-b border-l border-[#e9edf0] px-2 pb-0 sm:gap-4 sm:px-3">{weeklyMovement.map((movement) => { const max = Math.max(...weeklyMovement.flatMap((item) => [item.entries, item.exits]), 1); return <div key={movement.label} className="flex h-full flex-1 items-end gap-1"><div className="w-full rounded-t-sm bg-[#f6b59f]" style={{ height: `${(movement.entries / max) * 100}%` }} /><div className="w-full rounded-t-sm bg-[#e2613f]" style={{ height: `${(movement.exits / max) * 100}%` }} /></div>; })}</div>
                            <div className="mt-3 flex justify-between pl-2 text-xs capitalize text-[#8995a0] sm:pl-3">{weeklyMovement.map((movement) => <span key={movement.label}>{movement.label}</span>)}</div>
                            <div className="mt-5 flex gap-5 text-xs text-[#71808e]"><span className="flex items-center gap-2"><i className="size-2 rounded-full bg-[#e2613f]" />Saídas</span><span className="flex items-center gap-2"><i className="size-2 rounded-full bg-[#f6b59f]" />Entradas</span></div>
                        </section>

                        <section className="rounded-xl border border-[#e5e8eb] bg-white p-5 shadow-sm sm:p-6">
                            <div className="flex items-center justify-between"><div><h2 className="font-semibold text-[#17212b]">Atividades recentes</h2><p className="mt-1 text-sm text-[#71808e]">Últimas atualizações do sistema</p></div><button className="text-xs font-semibold text-[#e2613f]">Ver todas</button></div>
                            <div className="mt-5 divide-y divide-[#edf0f2]">{activity.map((item) => <div key={item.title} className="flex gap-3 py-4 first:pt-0 last:pb-0"><div className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${item.tone}`}><item.icon className="size-4" /></div><div className="min-w-0"><p className="text-sm font-semibold text-[#34414d]">{item.title}</p><p className="mt-0.5 text-xs leading-5 text-[#71808e]">{item.description}</p><p className="mt-1 text-[11px] text-[#a1aab2]">{item.time}</p></div></div>)}</div>
                        </section>
                    </div>

                    <section className="rounded-xl border border-[#e5e8eb] bg-white p-5 shadow-sm sm:p-6">
                        <div className="flex items-center justify-between"><div><h2 className="font-semibold text-[#17212b]">Acesso rápido</h2><p className="mt-1 text-sm text-[#71808e]">Atalhos para as tarefas mais usadas</p></div><ChevronRight className="size-5 text-[#a1aab2]" /></div>
                        <div className={`mt-5 grid gap-3 ${canManageProducts ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}><QuickLink href={productsIndex()} icon={Boxes} label="Gerenciar estoque" detail="Consulte seus produtos" />{canManageProducts && <QuickLink href={productsCreate()} icon={PackagePlus} label="Cadastrar produto" detail="Adicione um aparelho" />}<QuickLink href={movementsIndex()} icon={ArrowUpRight} label="Registrar movimentação" detail="Entrada ou saída" /><QuickLink href={repairsIndex()} icon={ClipboardCheck} label="Assistências" detail="Acompanhe os consertos" />{canManageProducts && <QuickLink href={cashIndex()} icon={Wallet} label="Fluxo de caixa" detail="Veja entradas e saídas" />}</div>
                    </section>
                </div>
            </div>
        </>
    );
}

function MetricCard({ label, value, detail, icon: Icon, tone }: { label: string; value: string; detail: string; icon: typeof Boxes; tone: 'orange' | 'amber' | 'green' | 'blue' }) {
    const tones = { orange: 'bg-[#fff1ec] text-[#e2613f]', amber: 'bg-[#fff7e7] text-[#d28a16]', green: 'bg-[#ebf8f0] text-[#2e9b5e]', blue: 'bg-[#edf5ff] text-[#4386d9]' };
    return <div className="rounded-xl border border-[#e5e8eb] bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><p className="text-sm text-[#71808e]">{label}</p><span className={`flex size-9 items-center justify-center rounded-lg ${tones[tone]}`}><Icon className="size-4" /></span></div><p className="mt-4 text-3xl font-semibold tracking-tight text-[#17212b]">{value}</p><p className="mt-1 text-xs text-[#71808e]">{detail}</p></div>;
}

function QuickLink({ href, icon: Icon, label, detail }: { href: RouteDefinition<'get'>; icon: typeof Boxes; label: string; detail: string }) {
    return <Link href={href} className="group flex items-center gap-3 rounded-lg border border-[#edf0f2] p-3 transition hover:border-[#f3c2b3] hover:bg-[#fffaf8]"><span className="flex size-9 items-center justify-center rounded-lg bg-[#fff1ec] text-[#e2613f]"><Icon className="size-4" /></span><span className="min-w-0"><span className="block text-sm font-semibold text-[#34414d]">{label}</span><span className="block text-xs text-[#8995a0]">{detail}</span></span><ChevronRight className="ml-auto size-4 text-[#b8c0c7] transition group-hover:translate-x-0.5 group-hover:text-[#e2613f]" /></Link>;
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
