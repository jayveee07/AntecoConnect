<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CorsMiddleware
{
    private array $allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:4173',
        'http://localhost:8000',
        'https://consumer-ten.vercel.app',
        'https://consumer-gold.vercel.app',
        'https://consumer.vercel.app',
        'https://admin-tau-two-97.vercel.app',
        'https://admin.vercel.app',
        'https://anteconnect.duckdns.org',
        'https://anteconnect-consumer-john-vince-paisan-s-projects.vercel.app',
        'https://anteconnect-consumer-git-master-john-vince-paisan-s-projects.vercel.app',
        'https://anteconnect-consumer.vercel.app',
    ];

    public function handle(Request $request, Closure $next): Response
    {
        $origin = $request->header('Origin');
        $allowedOrigin = in_array($origin, $this->allowedOrigins, true) ? $origin : '';
        $hasOrigin = $origin && $allowedOrigin;

        $headers = [
            'Access-Control-Allow-Origin' => $allowedOrigin,
            'Access-Control-Allow-Methods' => 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
            'Access-Control-Allow-Headers' => 'Content-Type, Authorization, X-Requested-With, X-XSRF-TOKEN, Accept',
            'Access-Control-Allow-Credentials' => $hasOrigin ? 'true' : 'false',
        ];

        if ($request->isMethod('OPTIONS')) {
            return response()->json([], 204, array_merge($headers, [
                'Access-Control-Max-Age' => '86400',
            ]));
        }

        $response = $next($request);
        foreach ($headers as $key => $value) {
            $response->headers->set($key, $value);
        }

        return $response;
    }
}
