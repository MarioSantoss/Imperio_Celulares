import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import InputError from '@/components/input-error';
import { dashboard } from '@/routes';
import { index as productsIndex, show as productShow, update as productUpdate } from '@/routes/products';

type Product = { id: number; name: string; brand: string; ram: string | null; storage: string | null; color: string | null; imei: string | null; cost_price: string; sale_price: string; stock: number; minimum_stock: number };
type Props = { product: Product; brands: string[] };

type FieldProps = { name: string; label: string; defaultValue: string | number; error?: string };

function Field({ name, label, defaultValue, error }: FieldProps) {
    return <label className="grid gap-2 text-sm font-medium text-[#34414d]">{label}<input name={name} defaultValue={defaultValue} className="h-11 rounded-lg border border-[#dfe4e8] bg-white px-3 text-sm outline-none focus:border-[#e2613f]" />{error && <InputError message={error} />}</label>;
}

export default function EditProduct({ product, brands }: Props) {
    return <><Head title={`Editar ${product.name}`} /><div className="min-h-full bg-[#f7f8fa] p-4 sm:p-6 lg:p-8"><div className="mx-auto max-w-4xl space-y-6"><Link href={productShow(product.id)} className="inline-flex items-center gap-2 text-sm font-medium text-[#71808e] hover:text-[#e2613f]"><ArrowLeft className="size-4" />Voltar para detalhes</Link><div><p className="text-sm font-medium text-[#e2613f]">Edição de produto</p><h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#17212b]">{product.name}</h1><p className="mt-1 text-sm text-[#71808e]">Atualize preços, especificações e estoque mínimo.</p></div><Form {...productUpdate.form(product.id)} className="space-y-5">{({ errors, processing }) => <><section className="grid gap-5 rounded-xl border border-[#e5e8eb] bg-white p-5 shadow-sm sm:grid-cols-2 sm:p-6"><Field name="name" label="Nome do modelo" defaultValue={product.name} error={errors.name} /><label className="grid gap-2 text-sm font-medium text-[#34414d]">Marca<select name="brand" defaultValue={product.brand} className="h-11 rounded-lg border border-[#dfe4e8] bg-white px-3 text-sm outline-none focus:border-[#e2613f]"><option value={product.brand}>{product.brand}</option>{brands.filter((brand) => brand !== product.brand).map((brand) => <option key={brand}>{brand}</option>)}<option>Apple</option><option>Samsung</option><option>Motorola</option><option>Xiaomi</option></select><InputError message={errors.brand} /></label><Field name="ram" label="Memória RAM" defaultValue={product.ram ?? ''} error={errors.ram} /><Field name="storage" label="Armazenamento" defaultValue={product.storage ?? ''} error={errors.storage} /><Field name="color" label="Cor" defaultValue={product.color ?? ''} error={errors.color} /><Field name="imei" label="IMEI" defaultValue={product.imei ?? ''} error={errors.imei} /><Field name="cost_price" label="Preço de custo" defaultValue={product.cost_price} error={errors.cost_price} /><Field name="sale_price" label="Preço de venda" defaultValue={product.sale_price} error={errors.sale_price} /><Field name="minimum_stock" label="Estoque mínimo" defaultValue={product.minimum_stock} error={errors.minimum_stock} /></section><div className="flex justify-end gap-3"><Link href={productsIndex()} className="rounded-lg border border-[#dfe4e8] bg-white px-5 py-2.5 text-sm font-semibold text-[#586675]">Cancelar</Link><button type="submit" disabled={processing} className="inline-flex items-center gap-2 rounded-lg bg-[#e2613f] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#c95031] disabled:opacity-60"><Save className="size-4" />{processing ? 'Salvando...' : 'Salvar alterações'}</button></div></>}</Form></div></div></>;
}

EditProduct.layout = { breadcrumbs: [{ title: 'Dashboard', href: dashboard() }, { title: 'Produtos', href: productsIndex() }, { title: 'Editar', href: productsIndex() }] };
