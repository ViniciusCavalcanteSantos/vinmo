<?php

namespace App\Observers;

use App\Models\Contract;
use Illuminate\Support\Facades\DB;

class ContractObserver
{
    /**
     * Handle the Contract "saved" event.
     * O evento 'saved' é disparado após 'create' e 'update'.
     */
    public function saved(Contract $contract): void
    {
        DB::afterCommit(function () use ($contract) {
            $this->updateSearchableContent($contract);
        });
    }

    /**
     * Atualiza o conteúdo de busca para um contrato.
     */
    public function updateSearchableContent(Contract $contract): void
    {
        $contract->load('address', 'graduationDetail');

        $searchableContent = collect([
            $contract->code,
            $contract->title,
            $contract->address?->city,
            $contract->address?->state,
            $contract->address?->neighborhood,
            $contract->graduationDetail?->institution_name,
            $contract->graduationDetail?->class,
            $contract->graduationDetail?->university_course,
        ])->filter()->implode(' ');

        // IMPORTANTE: Usamos uma atualização de query bruta (raw) aqui.
        // Se usássemos $contract->save(), dispararíamos o observer novamente,
        // criando um loop infinito. A atualização bruta evita isso.
        DB::table('contracts')
            ->where('id', $contract->id)
            ->update(['searchable' => $searchableContent]);
    }
}
