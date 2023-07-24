/** @type {import('./$types').RequestHandler} */

export async function POST({ request, platform }) {
  const { address, google_book_id, rating } = await request.json();
  try {
    const resReview = await platform?.env.JoyceDB.prepare(
      `INSERT INTO BookReviews(address, google_book_id) VALUES ('${address}', '${google_book_id}');`
    ).run();
    const resScore = await platform?.env.JoyceDB.prepare(
      `INSERT OR REPLACE INTO BookScore VALUES (
        ?,
        COALESCE((SELECT total_score FROM BookScore WHERE google_book_id = ?), 0) + ?
      );`
    )
      .bind(google_book_id, google_book_id, rating)
      .run();
    return new Response(JSON.stringify([resReview, resScore]), {
      status: 200
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e }), { status: 500 });
  }
}

export async function GET({ platform, url }) {
  try {
    const google_book_id = url.searchParams.get('bookId');
    const { results } = await platform?.env.JoyceDB.prepare(
      `SELECT address, total_score FROM BookScore bs, BookReviews br WHERE br.google_book_id LIKE ? AND bs.google_book_id LIKE br.google_book_id;`
    )
      .bind(google_book_id)
      .all();
    return new Response(
      JSON.stringify({
        reviewers: results.map((r) => r.address),
        score: results?.[0]?.total_score || 0
      }),
      { status: 200 }
    );
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e }), { status: 500 });
  }
}
