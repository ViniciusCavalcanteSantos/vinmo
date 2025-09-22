<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class LanguageSelector
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $lang = $request->header('Accept-Language', 'en');
        $map = [
            'en' => 'en',
            'pt-BR' => 'pt_BR'
        ];
        App::setLocale($map[$lang] ?? 'en');
        return $next($request);
    }
}
