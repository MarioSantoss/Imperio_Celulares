import { Form, Head, Link, usePage } from '@inertiajs/react';
import { Eye, Filter, Plus, Search } from 'lucide-react';
import { dashboard } from '@/routes';
import { create as productsCreate, index as productsIndex } from '@/routes/products';

import { show as productShow } from '@/routes/products';

type Product = { id: number; name: string; brand: string; imei: string | null; sale_price: string; stock: number; minimum_stock: number };
type Props = { products: { data: Product[]; from: number | null; to: number | null; total: number; prev_page_url: string | null; next_page_url: string | null }; search: string; totalStock: number };

export default function Products({ products, search, totalStock }: Props) {
    const { auth } = usePage().props;
    const canManageProducts = auth.user?.role === 'gerente' || auth.user?.role === 'proprietario';

    return (
        <>
            <Head title="Produtos" />
            <div className="min-h-full bg-[#f7f8fa] p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl space-y-6">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-medium text-[#e2613f]">Estoque</p><h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#17212b]">Consulta de produtos</h1><p className="mt-1 text-sm text-[#71808e]">Gerencie e visualize o inventário de dispositivos móveis.</p></div>{canManageProducts && <Link href={productsCreate()} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#e2613f] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#c95031] sm:w-auto"><Plus className="size-4" />Novo produto</Link>}</div>
                    <Form {...productsIndex.form()} className="rounded-xl border border-[#e5e8eb] bg-white p-4 shadow-sm"><div className="flex flex-col gap-3 md:flex-row"><label className="relative flex-1"><Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#9aa5ae]" /><input name="search" defaultValue={search} className="h-10 w-full rounded-lg border border-[#dfe4e8] pl-10 pr-3 text-sm outline-none placeholder:text-[#9aa5ae] focus:border-[#e2613f]" placeholder="Buscar por nome, marca ou IMEI" /></label><button type="submit" className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#dfe4e8] px-4 text-sm font-semibold text-[#586675] hover:border-[#e2613f] hover:text-[#e2613f]"><Filter className="size-4" />Buscar</button></div></Form>
                    <div className="overflow-hidden rounded-xl border border-[#e5e8eb] bg-white shadow-sm"><div className="flex items-center justify-between border-b border-[#edf0f2] px-5 py-4"><div><h2 className="font-semibold text-[#17212b]">Resumo do estoque</h2><p className="mt-1 text-sm text-[#71808e]">{totalStock.toLocaleString('pt-BR')} unidades totais</p></div></div><div className="overflow-x-auto"><table className="w-full min-w-190 text-left text-sm"><thead className="bg-[#fafbfc] text-xs uppercase tracking-wide text-[#8995a0]"><tr><th className="px-5 py-3 font-medium">Produto</th><th className="px-5 py-3 font-medium">Marca</th><th className="px-5 py-3 font-medium">IMEI</th><th className="px-5 py-3 font-medium">Preço</th><th className="px-5 py-3 font-medium">Quantidade</th><th className="px-5 py-3 font-medium">Status</th><th className="px-5 py-3" /></tr></thead><tbody className="divide-y divide-[#edf0f2]">{products.data.map((product) => { const lowStock = product.stock <= product.minimum_stock; return <tr key={product.id} className="hover:bg-[#fffaf8]"><td className="px-5 py-4 font-semibold text-[#34414d]">{product.name}</td><td className="px-5 py-4 text-[#71808e]">{product.brand}</td><td className="px-5 py-4 font-mono text-xs text-[#71808e]">{product.imei ?? 'Não informado'}</td><td className="px-5 py-4 font-medium text-[#34414d]">R$ {Number(product.sale_price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td><td className="px-5 py-4 text-[#34414d]">{product.stock}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${product.stock === 0 ? 'bg-red-50 text-red-600' : lowStock ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>{product.stock === 0 ? 'Esgotado' : lowStock ? 'Estoque baixo' : 'Em estoque'}</span></td><td className="px-5 py-4"><Link href={productShow(product.id)} aria-label={`Visualizar ${product.name}`} className="text-[#8995a0] hover:text-[#e2613f]"><Eye className="size-4" /></Link></td></tr>; })}</tbody></table></div><div className="flex flex-col gap-3 border-t border-[#edf0f2] px-5 py-4 text-xs text-[#8995a0] sm:flex-row sm:items-center sm:justify-between"><span>Mostrando {products.from ?? 0} a {products.to ?? 0} de {products.total} produtos</span><div className="flex gap-2">{products.prev_page_url ? <Link href={products.prev_page_url} className="rounded border border-[#dfe4e8] px-3 py-1.5 hover:border-[#e2613f]">Anterior</Link> : <span className="rounded border border-[#edf0f2] px-3 py-1.5 text-[#c0c7cd]">Anterior</span>}{products.next_page_url ? <Link href={products.next_page_url} className="rounded border border-[#dfe4e8] px-3 py-1.5 hover:border-[#e2613f]">Próxima</Link> : <span className="rounded border border-[#edf0f2] px-3 py-1.5 text-[#c0c7cd]">Próxima</span>}</div></div></div>
                </div>
            </div>
        </>
    );
}

Products.layout = { breadcrumbs: [{ title: 'Dashboard', href: dashboard() }, { title: 'Produtos', href: productsIndex() }] };
