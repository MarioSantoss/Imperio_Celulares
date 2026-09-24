import { Form, Head, Link } from '@inertiajs/react';
import { ArrowDownLeft, ArrowUpRight, ChevronDown, Download, Plus } from 'lucide-react';
import InputError from '@/components/input-error';
import { dashboard } from '@/routes';
import { index as movementsIndex, store as movementsStore } from '@/routes/movements';

type Product = { id: number; name: string; stock: number };
type Movement = { id: number; type: 'Entrada' | 'Saída'; quantity: number; reason: string; created_at: string; product: { name: string } };
type Props = { products: Product[]; movements: { data: Movement[]; from: number | null; to: number | null; total: number; prev_page_url: string | null; next_page_url: string | null } };

type SelectOption = { value: string; label: string };

export default function Movements({ products, movements }: Props) {
    return (
        <>
            <Head title="Movimentações" />
            <div className="min-h-full bg-[#f7f8fa] p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-6xl space-y-6">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                        <div><p className="text-sm font-medium text-[#e2613f]">Operação</p><h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#17212b]">Gestão de estoque</h1><p className="mt-1 text-sm text-[#71808e]">Registre entradas e saídas dos seus produtos.</p></div>
                        <button type="button" className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#dfe4e8] bg-white px-4 py-2.5 text-sm font-semibold text-[#586675] hover:border-[#e2613f] hover:text-[#e2613f]"><Download className="size-4" />Exportar relatório</button>
                    </div>
                    <Form {...movementsStore.form()} resetOnSuccess className="rounded-xl border border-[#e5e8eb] bg-white p-5 shadow-sm sm:p-6">
                        {({ errors, processing }) => (
                            <>
                                <div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-lg bg-[#fff1ec] text-[#e2613f]"><Plus className="size-4" /></span><div><h2 className="font-semibold text-[#17212b]">Nova movimentação</h2><p className="mt-1 text-sm text-[#71808e]">Atualize a quantidade de um produto.</p></div></div>
                                <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                    <Select name="product_id" label="Produto" options={products.map((product) => ({ value: String(product.id), label: `${product.name} (${product.stock} em estoque)` }))} error={errors.product_id} />
                                    <Select name="type" label="Tipo de movimentação" options={[{ value: 'Entrada', label: 'Entrada' }, { value: 'Saída', label: 'Saída' }]} error={errors.type} />
                                    <label className="grid gap-2 text-sm font-medium text-[#34414d]">Quantidade<input name="quantity" type="number" min="1" defaultValue="1" className="h-11 rounded-lg border border-[#dfe4e8] px-3 text-sm outline-none focus:border-[#e2613f]" /><InputError message={errors.quantity} /></label>
                                    <Select name="reason" label="Motivo" options={['Compra de fornecedor', 'Venda balcão', 'Devolução cliente', 'Ajuste de inventário'].map((value) => ({ value, label: value }))} error={errors.reason} />
                                </div>
                                <label className="mt-4 grid gap-2 text-sm font-medium text-[#34414d]">Observações<textarea name="notes" rows={2} className="rounded-lg border border-[#dfe4e8] px-3 py-2 text-sm outline-none focus:border-[#e2613f]" /><InputError message={errors.notes} /></label>
                                <div className="mt-4 flex justify-end"><button type="submit" disabled={processing} className="inline-flex items-center gap-2 rounded-lg bg-[#e2613f] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#c95031] disabled:opacity-60"><Plus className="size-4" />{processing ? 'Registrando...' : 'Registrar movimentação'}</button></div>
                            </>
                        )}
                    </Form>
                    <section className="overflow-hidden rounded-xl border border-[#e5e8eb] bg-white shadow-sm">
                        <div className="border-b border-[#edf0f2] px-5 py-4"><h2 className="font-semibold text-[#17212b]">Histórico recente</h2><p className="mt-1 text-sm text-[#71808e]">Últimas entradas e saídas registradas</p></div>
                        <div className="divide-y divide-[#edf0f2]">{movements.data.map((movement) => <div key={movement.id} className="flex items-center gap-4 px-5 py-4"><span className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${movement.type === 'Entrada' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>{movement.type === 'Entrada' ? <ArrowDownLeft className="size-4" /> : <ArrowUpRight className="size-4" />}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-[#34414d]">{movement.product.name}</p><p className="mt-1 text-xs text-[#8995a0]">{movement.reason}</p></div><p className="hidden text-xs text-[#8995a0] sm:block">{new Date(movement.created_at).toLocaleString('pt-BR')}</p><span className={`text-sm font-semibold ${movement.type === 'Entrada' ? 'text-emerald-600' : 'text-blue-600'}`}>{movement.type === 'Entrada' ? '+' : '-'}{movement.quantity}</span></div>)}</div>
                        <div className="flex flex-col gap-3 border-t border-[#edf0f2] px-5 py-4 text-xs text-[#8995a0] sm:flex-row sm:items-center sm:justify-between"><span>Mostrando {movements.from ?? 0} a {movements.to ?? 0} de {movements.total} movimentações</span><div className="flex gap-2">{movements.prev_page_url ? <Link href={movements.prev_page_url} className="rounded border border-[#dfe4e8] px-3 py-1.5 hover:border-[#e2613f]">Anterior</Link> : <span className="rounded border border-[#edf0f2] px-3 py-1.5 text-[#c0c7cd]">Anterior</span>}{movements.next_page_url ? <Link href={movements.next_page_url} className="rounded border border-[#dfe4e8] px-3 py-1.5 hover:border-[#e2613f]">Próxima</Link> : <span className="rounded border border-[#edf0f2] px-3 py-1.5 text-[#c0c7cd]">Próxima</span>}</div></div>
                    </section>
                </div>
            </div>
        </>
    );
}

function Select({ name, label, options, error }: { name: string; label: string; options: SelectOption[]; error?: string }) {
    return <label className="grid gap-2 text-sm font-medium text-[#34414d]">{label}<span className="relative"><select name={name} className="h-11 w-full appearance-none rounded-lg border border-[#dfe4e8] bg-white px-3 pr-9 text-sm font-normal outline-none focus:border-[#e2613f]"><option value="">Selecione</option>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select><ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[#8995a0]" /></span><InputError message={error} /></label>;
}

Movements.layout = { breadcrumbs: [{ title: 'Dashboard', href: dashboard() }, { title: 'Movimentações', href: movementsIndex() }] };
