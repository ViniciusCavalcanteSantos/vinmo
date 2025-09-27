<?php

namespace App\Services;

use App\Http\Requests\StoreContractRequest;
use App\Models\Contract;
use App\Models\ContractCategory;
use Illuminate\Support\Facades\DB;

class ContractService
{
    public function createContract(StoreContractRequest $request): Contract
    {
        $validated = $request->validated();
        $category = ContractCategory::where('slug', $validated['category'])->firstOrFail();

        return DB::transaction(function () use ($validated, $category) {
            $contract = Contract::create([
                'user_id' => auth()->id(),
                'category_id' => $category->id,
                'code' => $validated['code'],
                'title' => $validated['title'],
            ]);

            $contract->address()->create([
                'granularity' => 'city_area',
                'country' => $validated['country'],
                'state' => $validated['state'],
                'city' => $validated['city'],
            ]);

            if ($validated['category'] === 'graduation') {
                $contract->graduationDetail()->create([
                    'type' => $validated['type'],
                    'institution_name' => $validated['institution_name'],
                    'institution_acronym' => $validated['institution_acronym'],
                    'class' => $validated['class'],
                    'shift' => $validated['shift'],
                    'conclusion_year' => $validated['conclusion_year'],
                    'university_course' => $validated['type'] === 'university' ? $validated['university_course'] : null,
                    'school_grade_level' => $validated['type'] === 'school' ? $validated['school_grade_level'] : null,
                ]);
            }

            return $contract;
        });
    }
}