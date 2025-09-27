<?php

namespace App\Observers;

use App\Models\Address;

class AddressObserver
{
    /**
     * Handle the Address "saving" event.
     * @throws \Exception
     */
    public function saving(Address $address): void
    {
        if ($address->granularity === 'full_address') {
            if (empty($address->street) || empty($address->number) || empty($address->neighborhood) || empty($address->postal_code)) {
                throw new \Exception(__('For a full address, street, number, neighborhood, and postal code are required.'));
            }

            if ($address->granularity === 'city_area') {
                $address->street = null;
                $address->number = null;
                $address->complement = null;
                $address->neighborhood = null;
                $address->postal_code = null;
            }
        }
    }

    /**
     * Handle the Address "created" event.
     */
    public function created(Address $address): void
    {
        //
    }

    /**
     * Handle the Address "updated" event.
     */
    public function updated(Address $address): void
    {
        //
    }

    /**
     * Handle the Address "deleted" event.
     */
    public function deleted(Address $address): void
    {
        //
    }

    /**
     * Handle the Address "restored" event.
     */
    public function restored(Address $address): void
    {
        //
    }

    /**
     * Handle the Address "force deleted" event.
     */
    public function forceDeleted(Address $address): void
    {
        //
    }
}
