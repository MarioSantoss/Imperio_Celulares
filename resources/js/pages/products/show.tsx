import { Form, Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { dashboard } from '@/routes';
import { destroy as productDestroy, edit as productEdit, index as productsIndex, show as productShow } from '@/routes/products';

type Product = { id: number; name: string; brand: string; ram: string | null; storage: string | null; color: string | null; imei: string | null; cost_price: string; sale_price: string; stock: number; minimum_stock: number };

export default function ShowProduct({ product }: { product: Product }) {
    const { auth } = usePage().props;
    const canEdit = auth.user?.role === 'gerente' || auth.user?.role === 'proprietario';
    const canDelete = auth.user?.role === 'proprietario';

    return <><Head title={product.name} /><div className="min-h-full bg-[#f7f8fa] p-4 sm:p-6 lg:p-8"><div className="mx-auto max-w-4xl space-y-6"><Link href={productsIndex()} className="inline-flex items-center gap-2 text-sm font-medium text-[#71808e] hover:text-[#e2613f]"><ArrowLeft className="size-4" />Voltar para produtos</Link><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-medium text-[#e2613f]">Detalhes do produto</p><h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#17212b]">{product.name}</h1><p className="mt-1 text-sm text-[#71808e]">{product.brand} {product.imei ? `· IMEI ${product.imei}` : ''}</p></div>{(canEdit || canDelete) && <div className="flex gap-2">{canEdit && <Link href={productEdit(product.id)} className="inline-flex items-center gap-2 rounded-lg border border-[#dfe4e8] bg-white px-4 py-2.5 text-sm font-semibold text-[#586675] hover:border-[#e2613f] hover:text-[#e2613f]"><Pencil className="size-4" />Editar</Link>}{canDelete && <Form {...productDestroy.form(product.id)}><button type="submit" className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"><Trash2 className="size-4" />Excluir</button></Form>}</div>}</div><section className="grid gap-4 sm:grid-cols-2"><Detail label="Marca" value={product.brand} /><Detail label="Cor" value={product.color ?? 'Não informado'} /><Detail label="Memória RAM" value={product.ram ?? 'Não informado'} /><Detail label="Armazenamento" value={product.storage ?? 'Não informado'} /><Detail label="Preço de custo" value={`R$ ${Number(product.cost_price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} /><Detail label="Preço de venda" value={`R$ ${Number(product.sale_price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} /><Detail label="Estoque atual" value={`${product.stock} unidades`} /><Detail label="Estoque mínimo" value={`${product.minimum_stock} unidades`} /></section></div></div></>;
}

function Detail({ label, value }: { label: string; value: string }) { return <div className="rounded-xl border border-[#e5e8eb] bg-white p-5 shadow-sm"><p className="text-xs uppercase tracking-wide text-[#8995a0]">{label}</p><p className="mt-2 font-semibold text-[#34414d]">{value}</p></div>; }

ShowProduct.layout = { breadcrumbs: [{ title: 'Dashboard', href: productsIndex() }, { title: 'Produtos', href: productsIndex() }, { title: 'Detalhes', href: productShow(1) }] };
