import { Link, usePage } from '@inertiajs/react';
import { Boxes, ClipboardCheck, ClipboardList, LayoutGrid, PackagePlus, Wallet } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as productsIndex, create as productsCreate } from '@/routes/products';
import { index as movementsIndex } from '@/routes/movements';
import { index as repairsIndex, create as repairsCreate } from '@/routes/repairs';
import { index as cashIndex } from '@/routes/cash';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Produtos',
        href: productsIndex(),
        icon: Boxes,
    },
    {
        title: 'Cadastrar produto',
        href: productsCreate(),
        icon: PackagePlus,
    },
    {
        title: 'Movimentações',
        href: movementsIndex(),
        icon: ClipboardList,
    },
    {
        title: 'Assistências',
        href: repairsIndex(),
        icon: ClipboardCheck,
    },
    {
        title: 'Nova assistência',
        href: repairsCreate(),
        icon: PackagePlus,
    },
    {
        title: 'Fluxo de caixa',
        href: cashIndex(),
        icon: Wallet,
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const { auth } = usePage().props;
    const canManageProducts = auth.user?.role === 'gerente' || auth.user?.role === 'proprietario';

    const navigationItems = canManageProducts
        ? mainNavItems
        : mainNavItems.filter((item) => !['Cadastrar produto', 'Fluxo de caixa'].includes(item.title));

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navigationItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
