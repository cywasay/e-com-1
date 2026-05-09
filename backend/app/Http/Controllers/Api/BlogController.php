<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BlogController extends Controller
{
    /**
     * Display a listing of published blog posts (public).
     */
    public function indexPublic()
    {
        $posts = BlogPost::published()
            ->with('author:id,name')
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        return response()->json($posts);
    }

    /**
     * Display a single published blog post by slug (public).
     */
    public function showPublic($slug)
    {
        $post = BlogPost::published()
            ->with('author:id,name')
            ->where('slug', $slug)
            ->firstOrFail();

        return response()->json($post);
    }

    /**
     * Display all posts including drafts (admin).
     */
    public function indexAdmin()
    {
        $posts = BlogPost::with('author:id,name')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($posts);
    }

    /**
     * Store a newly created post (admin).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'featured_image' => 'nullable|string',
            'category_tag' => 'nullable|string',
            'status' => 'required|in:draft,published',
            'excerpt' => 'nullable|string',
        ]);

        $validated['author_id'] = $request->user()->id;
        $validated['slug'] = Str::slug($validated['title']);

        // Handle slug collision
        $count = BlogPost::where('slug', 'like', $validated['slug'] . '%')->count();
        if ($count > 0) {
            $validated['slug'] .= '-' . ($count + 1);
        }

        $post = BlogPost::create($validated);

        return response()->json($post, 201);
    }

    /**
     * Update an existing post (admin).
     */
    public function update(Request $request, $id)
    {
        $post = BlogPost::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string',
            'featured_image' => 'nullable|string',
            'category_tag' => 'nullable|string',
            'status' => 'sometimes|required|in:draft,published',
            'excerpt' => 'nullable|string',
        ]);

        if (isset($validated['title']) && $validated['title'] !== $post->title) {
            $validated['slug'] = Str::slug($validated['title']);
            $count = BlogPost::where('slug', 'like', $validated['slug'] . '%')->where('id', '!=', $id)->count();
            if ($count > 0) {
                $validated['slug'] .= '-' . ($count + 1);
            }
        }

        $post->update($validated);

        return response()->json($post);
    }

    /**
     * Soft delete a post (admin).
     */
    public function destroy($id)
    {
        $post = BlogPost::findOrFail($id);
        $post->delete();

        return response()->json(['success' => true]);
    }
}
