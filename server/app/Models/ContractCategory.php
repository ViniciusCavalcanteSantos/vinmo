<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContractCategory extends Model
{
    protected $table = 'contracts_categories';
    protected $fillable = ['name', 'slug'];
}
