import dbConnect from '@/lib/dbConnect';
import PostModel from '@/models/post.model';
import { NextResponse } from 'next/server';



export async function GET(req: Request, context:{params:Promise<object>}): Promise<NextResponse> {
    await dbConnect();

    try {

        console.log("context: ", context)
        const params = await context.params;
        console.log("tyoeof params: ", typeof params)
        const slug = params.slug;
        console.log(typeof slug)
        console.log(slug)
        if (!slug) {
            return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
        }

        const blog = await PostModel.findOne({ slug, isPublished: true });

        if (!blog) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }

        return NextResponse.json(blog, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

// [context: {
//     params: Promise {
//         {
//         slug: 'how-to-excel-in-your-fashion-work-tips-for-building-a-standout-portfolio'
//     },
//     slug: 'how-to-excel-in-your-fashion-work-tips-for-building-a-standout-portfolio',
//     [Symbol(async_id_symbol)]: 280810,
//     [Symbol(trigger_async_id_symbol)]: 280338,
//     [Symbol(kResourceStore)]: {
//         isStaticGeneration: false,
//         page: '/api/blogs/[slug]/route',
//         fallbackRouteParams: null,
//         route: '/api/blogs/[slug]',
//         incrementalCache: [IncrementalCache],
//         cacheLifeProfiles: [Object],
//         isRevalidate: false,
//         isPrerendering: undefined,
//         fetchCache: undefined,
//         isOnDemandRevalidate: undefined,
//         isDraftMode: undefined,
//         requestEndedState: undefined,
//         isPrefetchRequest: undefined,
//         buildId: 'development',
//         reactLoadableManifest: {},
//         assetPrefix: '',
//         afterContext: undefined
//     },
//     [Symbol(kResourceStore)]: {
//         type: 'request',
//         phase: 'action',
//         implicitTags: [Array],
//         url: [Object],
//         headers: [Getter],
//         cookies: [Getter / Setter],
//         mutableCookies: [Getter],
//         userspaceMutableCookies: [Getter],
//         draftMode: [Getter],
//         renderResumeDataCache: null,
//         devWarmupPrerenderResumeDataCache: null,
//         isHmrRefresh: false,
//         serverComponentsHmrCache: undefined
//     },
//     [Symbol(kResourceStore)]: undefined,
//     [Symbol(kResourceStore)]: undefined,
//     [Symbol(kResourceStore)]: undefined,
//     [Symbol(kResourceStore)]: { isAppRoute: true, isAction: false }
//     }
// }];