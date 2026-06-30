import DOMPurify from "dompurify";

/** Renders the user's profile bio as HTML. */
export function Profile({ bioHtml }: { bioHtml: string }) {
  return (
    <section className="profile">
      <h3>Bio</h3>
      <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(bioHtml) }} />
    </section>
  );
}
