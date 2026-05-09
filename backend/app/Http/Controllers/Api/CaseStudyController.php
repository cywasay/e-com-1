<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CaseStudy;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CaseStudyController extends Controller
{
    /**
     * Display a listing of published case studies (public).
     */
    public function indexPublic()
    {
        $caseStudies = CaseStudy::published()
            ->with('author:id,name')
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        return response()->json($caseStudies);
    }

    /**
     * Display a single published case study by slug (public).
     */
    public function showPublic($slug)
    {
        $caseStudy = CaseStudy::published()
            ->with('author:id,name')
            ->where('slug', $slug)
            ->firstOrFail();

        return response()->json($caseStudy);
    }

    /**
     * Display all case studies (admin).
     */
    public function indexAdmin()
    {
        $caseStudies = CaseStudy::with('author:id,name')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($caseStudies);
    }

    /**
     * Store a newly created case study (admin).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'client_name' => 'nullable|string',
            'industry' => 'nullable|string',
            'featured_image' => 'nullable|string',
            'status' => 'required|in:draft,published',
            'excerpt' => 'nullable|string',
        ]);

        $validated['author_id'] = $request->user()->id;
        $validated['slug'] = Str::slug($validated['title']);

        // Handle slug collision
        $count = CaseStudy::where('slug', 'like', $validated['slug'] . '%')->count();
        if ($count > 0) {
            $validated['slug'] .= '-' . ($count + 1);
        }

        $caseStudy = CaseStudy::create($validated);

        return response()->json($caseStudy, 201);
    }

    /**
     * Update an existing case study (admin).
     */
    public function update(Request $request, $id)
    {
        $caseStudy = CaseStudy::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string',
            'client_name' => 'nullable|string',
            'industry' => 'nullable|string',
            'featured_image' => 'nullable|string',
            'status' => 'sometimes|required|in:draft,published',
            'excerpt' => 'nullable|string',
        ]);

        if (isset($validated['title']) && $validated['title'] !== $caseStudy->title) {
            $validated['slug'] = Str::slug($validated['title']);
            $count = CaseStudy::where('slug', 'like', $validated['slug'] . '%')->where('id', '!=', $id)->count();
            if ($count > 0) {
                $validated['slug'] .= '-' . ($count + 1);
            }
        }

        $caseStudy->update($validated);

        return response()->json($caseStudy);
    }

    /**
     * Soft delete a case study (admin).
     */
    public function destroy($id)
    {
        $caseStudy = CaseStudy::findOrFail($id);
        $caseStudy->delete();

        return response()->json(['success' => true]);
    }
}
