<?php

namespace App\Policies;

use App\Models\ProductIssue;
use App\Models\User;

class ProductIssuePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['proprietario', 'gerente', 'atendente'], true);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, ProductIssue $productIssue): bool
    {
        return $this->viewAny($user);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $this->viewAny($user);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ProductIssue $productIssue): bool
    {
        return in_array($user->role, ['proprietario', 'gerente'], true);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ProductIssue $productIssue): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, ProductIssue $productIssue): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, ProductIssue $productIssue): bool
    {
        return false;
    }
}
