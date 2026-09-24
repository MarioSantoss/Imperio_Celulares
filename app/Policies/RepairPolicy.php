<?php

namespace App\Policies;

use App\Models\Repair;
use App\Models\User;

class RepairPolicy
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
    public function view(User $user, Repair $repair): bool
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
    public function update(User $user, Repair $repair): bool
    {
        return in_array($user->role, ['proprietario', 'gerente'], true);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Repair $repair): bool
    {
        return $user->role === 'proprietario';
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Repair $repair): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Repair $repair): bool
    {
        return false;
    }
}
