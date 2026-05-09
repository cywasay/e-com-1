<?php

namespace App\Http\Middleware;

use App\Models\Site;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ResolveSite
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $domain = $request->header('X-Site-Domain');

        if ($domain) {
            $site = Site::where('domain', $domain)
                ->where('is_active', true)
                ->first();

            if ($site) {
                $request->merge(['site' => $site]);
                // Also set it as a property for easy access
                $request->site = $site;
            }
        }

        return $next($request);
    }
}
