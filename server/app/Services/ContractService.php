<?php

namespace App\Services;

use App\Http\Requests\ContractRequest;
use App\Models\Contract;
use App\Models\ContractCategory;
use Illuminate\Support\Facades\DB;

class ContractService
{
    public function createContract(ContractRequest $request): Contract
    {
        $validated = $request->validated();
        $category = ContractCategory::where('slug', $validated['category'])->firstOrFail();

        return DB::transaction(function () use ($validated, $category) {
            $contract = Contract::create([
                'organization_id' => auth()->user()->organization_id,
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
                    'institution_acronym' => $validated['institution_acronym'] ?? null,
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

    public function updateContract(Contract $contract, ContractRequest $request): Contract
    {
        $validated = $request->validated();

        return DB::transaction(function () use ($contract, $validated) {
            $contract->update([
                'organization_id' => auth()->user()->organization_id,
                'code' => $validated['code'],
                'title' => $validated['title'],
            ]);

            $contract->address()->updateOrCreate([], [
                'granularity' => 'city_area',
                'country' => $validated['country'],
                'state' => $validated['state'],
                'city' => $validated['city'],
            ]);

            if ($contract->category->slug === 'graduation') {
                $contract->graduationDetail()->updateOrCreate([], [
                    'type' => $validated['type'],
                    'institution_name' => $validated['institution_name'],
                    'institution_acronym' => $validated['institution_acronym'],
                    'class' => $validated['class'],
                    'shift' => $validated['shift'],
                    'conclusion_year' => $validated['conclusion_year'],
                    'university_course' => $validated['type'] === 'university' ? $validated['university_course'] : null,
                    'school_grade_level' => $validated['type'] === 'school' ? $validated['school_grade_level'] : null,
                ]);
            } else {
                $contract->graduationDetail()->delete();
            }

            return $contract;
        });
    }
}