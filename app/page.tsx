import FeedbackSection from "./components/FeedbackSection";

// ─── The review, exactly as written by the author — never reworded ───
// Inline <em> / <span> tags control typography only; the words are verbatim.

function Amount({
  children,
}: {
  children: React.ReactNode;
}) {
  // The ₹35 vs ₹10 crore wink: typographic only — larger serif numerals and a
  // hairline underline. Never a colored card.
  return (
    <span className="amount inline-block whitespace-nowrap border-b border-ink/25 pb-[2px] font-display text-[1.28em] font-medium leading-[1.5]">
      {children}
    </span>
  );
}

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-[40rem] px-6 pb-24 sm:pb-32">
      {/* ── Opening ─────────────────────────────────────────────── */}
      <header className="pt-20 text-center sm:pt-28">
        <p className="text-[0.6875rem] uppercase tracking-[0.24em] text-ink/70">
          My First Book Review&nbsp;&nbsp;·&nbsp;&nbsp;2026
        </p>
        <h1 className="mt-8 font-display text-[clamp(3.6rem,14vw,6rem)] font-medium leading-[0.95] tracking-[-0.02em]">
          Zidd
        </h1>
        <p className="mx-auto mt-6 max-w-[34rem] [text-wrap:balance] font-display text-[1.3rem] italic leading-snug text-ink/85 sm:text-2xl">
          A little madness, a lot of love, and a ₹10 crore revenge plan.
        </p>
        <p className="mt-10 text-sm text-ink/70">
          Written by <span className="font-medium text-ink">Manideep Polepalli</span>
        </p>

        <hr className="mx-auto mt-12 w-16 border-ink/25" />

        <p className="mx-auto mt-10 max-w-[30rem] font-display text-[1.35rem] leading-relaxed text-ink/85">
          Some books entertain you. Some make you laugh. And some leave you
          wondering what on earth you just read.
        </p>
      </header>

      {/* ── The review ──────────────────────────────────────────── */}
      <article className="mt-16 sm:mt-20">
        <h2 className="sr-only">My review of Zidd</h2>
        <div className="space-y-8 text-[1.125rem] leading-[1.85]">
          <p>
            Proof that your twenties are not the age to be mature or have
            everything figured out. It's the age to enjoy, make mistakes, and
            obsess over somebody you love.
          </p>
          <p>
            I genuinely cannot describe this book in one word, so here's
            everything that comes to my mind when I think about it: love,
            friendship, parental pressure, conspiracy, betrayal, and, above
            all, the craziest revenge idea ever. Total <em>pyaar mein andha</em>{" "}
            lover-boy vibes, along with some proper Mumbaikar slang!
          </p>
          <p>
            We follow Vihaan, whose life is nothing less than a roller coaster.
            After spending years blindly fulfilling his father's expectations,
            he finally gives up and decides to study Visual Arts at a
            university of his own choice.
          </p>
          <p>
            That's where he falls in love with Raina. She starts dating another
            guy, breaks up with him, comes back to Vihaan, and then, thanks to
            some conspiracies, breaks things off with him too.
          </p>
          <p>
            And just when you think things couldn't get worse for Vihaan,
            everybody starts giving up on him. Well, almost everybody. He still
            has Parth, his best friend, who would do literally anything for him
            in the blink of an eye.
          </p>
          <p>
            Now, Vihaan wants to prove to his father and Raina that he's not a
            nobody and that he can actually do something with his life. So what
            does he do? Drops out of college and decides that he wants his face
            on every billboard in Ahmedabad. The cost? Just <Amount>₹10 crore</Amount>!
          </p>
          <p>
            And guess how much money he has in his pocket already? A grand
            total of <Amount>₹35</Amount>. What a solid financial plan!
          </p>
          <p>
            And that's where the craziest journey of bringing this absolutely
            insane revenge idea to life begins.
          </p>
          <p>
            Honestly, this is one of the funniest books I've read in 2026. But
            it's not just about the humour. Somewhere between all the madness,
            it also talks about parental expectations, the pressure of trying
            to live up to them, the unexpected challenges life throws at you,
            how a genuinely loving heart can often be misunderstood, and, most
            importantly, having the courage to dream ridiculously big.
          </p>
        </div>

        <hr className="my-14 border-ink/15" />

        <p className="text-[1.0625rem] leading-[1.85] text-ink/85">
          P.S. This isn't exactly the original text I typed, but this is what I
          was trying to express through my review. It's my first attempt at
          reviewing a book, so I'm still figuring things out. If you read it
          and have any suggestions or feedback, I'd be the happiest to hear
          them! Always open to learning and improving. ❤️
        </p>
      </article>

      {/* ── A little note from me ───────────────────────────────── */}
      <section aria-labelledby="personal-note" className="mt-20">
        <hr className="border-ink/15" />
        <div className="mt-14">
          <h2
            id="personal-note"
            className="text-center font-display text-3xl font-medium tracking-[-0.01em] sm:text-4xl"
          >
            A little note from me
          </h2>

          <div className="mt-10 space-y-6 text-[1.0625rem] leading-[1.85] text-ink/90">
            <p>
              This is genuinely my first attempt at reviewing a book. I've
              never really tried expressing my reading experience through a
              review before.
            </p>
            <p>
              But <em className="font-display">Zidd</em> was something else. It
              was probably the funniest and most chaotic book I've read in
              2026. Reading it felt like exploring one unexpected situation
              after another, laughing at the madness, and enjoying every little
              twist.
            </p>
            <p>
              I'm still figuring out how to put my thoughts into words, so this
              is also a learning experience for me.
            </p>
            <p>
              If you've read my review, I'd genuinely love to know what you
              think. Be honest. I'm here to learn.
            </p>
          </div>

          <p className="mt-10 text-right font-display text-xl italic text-ink/85">
            — Manideep Polepalli
          </p>
        </div>
      </section>

      {/* ── Your turn: the form + the community ─────────────────── */}
      <section aria-labelledby="your-turn" className="mt-20">
        <hr className="border-ink/15" />
        <FeedbackSection />
      </section>

      <footer className="mt-24 text-center text-[0.6875rem] uppercase tracking-[0.24em] text-ink/70">
        A Reader's First Review&nbsp;&nbsp;·&nbsp;&nbsp;Zidd&nbsp;&nbsp;·&nbsp;&nbsp;2026
      </footer>
    </main>
  );
}
