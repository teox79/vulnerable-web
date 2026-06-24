/** Renders a user-submitted comment as HTML. */
export function Comment({ html }: { html: string }) {
  return (
    <section className="comment">
      <h3>Commento</h3>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </section>
  );
}
