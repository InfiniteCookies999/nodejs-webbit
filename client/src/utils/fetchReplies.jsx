
export default async function fetchReplies(comments, abortController) {

  let replyQueue = comments.rows
    .map(comment => ({ comment: comment, depth: 1 }));

  while (replyQueue.length !== 0) {
    const entry = replyQueue.pop();
    const comment = entry.comment;
    const response = await fetch(`/api/comment/replies/page?commentId=${comment.id}&pageNumber=0`,
      { signal: abortController.signal });
    if (abortController.signal.aborted) {
      break;
    }
    const replies = await response.json();

    comment.replies = replies.rows;
    comment.remainingReplies = replies.count - replies.rows.length;

    if (entry.depth <= 5) {
      replyQueue = replyQueue.concat(replies.rows.map(comment => ({
        comment: comment, depth: entry.depth + 1
      })));
    } else {
      comment.replies = await Promise.all(comment.replies.map(async reply => {
          const response =
            await fetch(`/api/comment/replyCount/${reply.id}`,
              { signal: abortController.signal });
          const json = await response.json();
          return {
            ...reply,
            remainingReplies: json.count
          }; 
      }));
    }
  }
}