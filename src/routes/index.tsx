import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SafetyNote } from "@/components/safety-note";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The First-Year Trigger Map — Ncredible Solutions" },
      {
        name: "description",
        content:
          "A gentle guide and toolkit for the moments grief catches you off guard — recognize what's happening, release the shame, and choose one next survivable step.",
      },
      { property: "og:title", content: "The First-Year Trigger Map" },
      {
        property: "og:description",
        content:
          "Peer-support education for the first year of grief. Understand your triggers, and choose one gentle next step. $47.",
      },
    ],
  }),
  component: HomePage,
});

const PART_ONE = [
  "What a Grief Trigger Actually Is",
  "Why the Small Things Ambush You",
  "You Are Not Doing This Wrong",
  "The Shapes First-Year Triggers Take",
  "When to Reach for More Support",
];

const PART_TWO = [
  {
    name: "Trigger Pattern Worksheet",
    note: "Notice what keeps catching you, and what came just before it.",
  },
  {
    name: "What to Say to Yourself Cards",
    note: "Short, kind sentences for the moment your chest goes tight.",
  },
  {
    name: "Trigger Prep Card",
    note: "A one-page plan for a date, a gathering, or an errand you're dreading.",
  },
  {
    name: "The Both/And List",
    note: "Room for grief that came with complications, relief, or anger.",
  },
  {
    name: "Next Survivable Step Companion",
    note: "The guided AI tool — described just below.",
  },
];

function HomePage() {
  return (
    <div>
      {/* 1. HERO */}
      <section className="mx-auto max-w-3xl px-6 pt-20 pb-16">
        <p className="text-xs tracking-[0.22em] text-muted-foreground uppercase">
          Ncredible Solutions
        </p>
        <h1 className="mt-6 text-4xl text-balance sm:text-[3.25rem]">
          When a Memory, a Date, or an Ordinary Moment Catches You Off Guard
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          The First-Year Trigger Map helps you recognize what's happening, release the extra shame,
          and choose one gentle next step — at your own pace.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-4">
          <Button asChild size="lg" className="px-8">
            <Link to="/checkout" search={{ bundle: undefined }}>
              Get the Guide — $47
            </Link>
          </Button>
          <span className="text-sm text-muted-foreground">
            Instant access · Yours to keep · Read at your own pace
          </span>
        </div>
      </section>

      {/* 2. THE AMBUSH MOMENT */}
      <section className="border-y border-border/70 bg-secondary/50">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <p className="font-display text-2xl leading-snug text-balance">
            One second you're doing something unremarkable — reaching for the wrong brand of coffee,
            filling in a form, hearing three notes of a song in a parking lot.
          </p>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            The next second you're somewhere else entirely. Not remembering it — inside it. And then
            you have to put your face back together and finish the errand, because the world doesn't
            pause for the smell of someone's shampoo in aisle four.
          </p>
        </div>
      </section>

      {/* 3. WHY THIS HAPPENS */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="text-3xl">Why this happens — and why it isn't a setback</h2>
        <div className="mt-6 space-y-5 text-[1.05rem] leading-relaxed text-muted-foreground">
          <p>
            Most of us brace for the big ones. The anniversary. The birthday. The first holiday with
            an empty chair. Those days are hard, but at least you can see them coming.
          </p>
          <p>
            What nobody prepares you for is the ordinary stuff. A voicemail you forgot was saved. A
            handwriting sample on an old grocery list. Someone else's laugh in a crowded room. And
            because you didn't see it coming, the surprise itself gets misread — as proof that
            you're slipping, that you should be further along, that something is wrong with the way
            you're doing this.
          </p>
          <p>
            That's the shame spiral: the grief, and then the second layer of judgment stacked on top
            of it for still having the grief.
          </p>
          <p className="border-l-2 border-primary/50 pl-6 text-foreground">
            A trigger is not a setback. It is not backsliding. It is evidence of how present that
            person, that body, that relationship still is in your life. The goal was never to stop
            being ambushed. It's to know what's happening when you are, and to have something to do
            next.
          </p>
        </div>
      </section>

      {/* 4. WHAT'S INSIDE */}
      <section className="border-y border-border/70 bg-secondary/50">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-3xl">What's inside</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <Card className="border-border/80">
              <CardContent className="p-8">
                <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
                  Part One — Understanding
                </p>
                <h3 className="mt-3 text-xl">To read</h3>
                <ul className="mt-6 space-y-4">
                  {PART_ONE.map((item) => (
                    <li key={item} className="flex gap-4 leading-relaxed">
                      <span
                        aria-hidden
                        className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border/80">
              <CardContent className="p-8">
                <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
                  Part Two — The Toolkit
                </p>
                <h3 className="mt-3 text-xl">To do</h3>
                <ul className="mt-6 space-y-5">
                  {PART_TWO.map((item) => (
                    <li key={item.name} className="flex gap-4">
                      <span
                        aria-hidden
                        className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                      />
                      <span>
                        <span className="font-medium">{item.name}</span>
                        <span className="block text-sm leading-relaxed text-muted-foreground">
                          {item.note}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 5. AI COMPANION */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-xs tracking-[0.22em] text-muted-foreground uppercase">
          Included with your purchase
        </p>
        <h2 className="mt-4 text-3xl">The Next Survivable Step Companion</h2>
        <p className="mt-5 text-[1.05rem] leading-relaxed text-muted-foreground">
          A short guided reflection tool that lives inside your library. You tell it what's
          happening right now, roughly how much capacity you have, and what kind of support you
          actually want — practical, comforting, or just permission to do nothing.
        </p>
        <p className="mt-4 text-[1.05rem] leading-relaxed text-muted-foreground">
          It gives you back a personalized <em>Next Survivable Step Card</em> — one step, sized to
          the day you're actually having. Save it, print it, keep it in your bag. Use it as many
          times as you need; the answer can be different every time, because you are.
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          This is a real tool, not a static worksheet — and it never tells you how you should feel.
        </p>
      </section>

      {/* 6. FOUNDER */}
      <section className="border-y border-border/70 bg-secondary/50">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h2 className="text-2xl">Who wrote this</h2>
          <p className="mt-5 text-[1.05rem] leading-relaxed text-muted-foreground">
            Written by the founder of Ncredible Solutions — a Human Resources professional with 25+
            years of experience helping employees navigate grief and loss, who also carries her own
            experience of profound loss. She writes as a lived-experience peer-support educator, not
            a clinician.
          </p>
        </div>
      </section>

      {/* 7. WHAT THIS IS NOT */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <SafetyNote />
      </section>

      {/* 8. PRICING */}
      <section className="mx-auto max-w-3xl px-6 pb-16">
        <h2 className="text-3xl">Simple pricing</h2>
        <Card className="mt-8 border-primary/50">
          <CardContent className="p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h3 className="text-2xl">The First-Year Trigger Map</h3>
              <span className="font-display text-3xl text-primary">$47</span>
            </div>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Both parts, the full toolkit, and the Next Survivable Step Companion. One payment,
              yours to keep.
            </p>
            <Button asChild size="lg" className="mt-7 w-full sm:w-auto sm:px-10">
              <Link to="/checkout" search={{ bundle: undefined }}>
                Get the Guide — $47
              </Link>
            </Button>
          </CardContent>
        </Card>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-sm border border-border/80 bg-card p-6">
            <p className="font-display text-lg">Tender Dates &amp; Gatherings Pack — $17</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              A short, practical add-on for the days on the calendar you can already feel coming.
              Offered as an optional add-on at checkout.
            </p>
          </div>
          <div className="rounded-sm border border-border/80 bg-card p-6">
            <p className="font-display text-lg">The Complete Bundle — $97</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              All five resources for people who want the whole shelf. Best value.{" "}
              <Link to="/bundle" className="text-primary underline underline-offset-4">
                See what's included
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* 9. FAQ */}
      <section className="mx-auto max-w-3xl px-6 pb-16">
        <h2 className="text-3xl">Questions people ask</h2>
        <Accordion type="single" collapsible className="mt-6">
          <AccordionItem value="q1">
            <AccordionTrigger>Is this a replacement for therapy?</AccordionTrigger>
            <AccordionContent>
              No. This is peer-support education and a practical toolkit — it is not a substitute
              for professional care. Many people use it alongside a therapist, a grief group, or a
              doctor, and Part One includes a section on when to reach for more support.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q2">
            <AccordionTrigger>What if it's been longer than a year?</AccordionTrigger>
            <AccordionContent>
              Then it's still for you. The tools work for anyone still navigating grief triggers,
              whatever the timeline. There is no expiration date on needing this, and no schedule
              you were supposed to keep.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q3">
            <AccordionTrigger>How does the AI companion tool work?</AccordionTrigger>
            <AccordionContent>
              You answer a few guided questions — what's happening, how much capacity you have, and
              what kind of support you want. It returns a personalized Next Survivable Step Card
              that you can save or print, and you can use it as many times as you need.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* 10. CLOSING */}
      <section className="mx-auto max-w-3xl px-6 pb-20">
        <div className="paper-rule mb-12" />
        <p className="font-display text-2xl leading-snug text-balance">
          You did not choose this year, and you don't owe it a graceful shape. You only owe yourself
          the next survivable step.
        </p>
        <Button asChild size="lg" className="mt-8 px-8">
          <Link to="/checkout" search={{ bundle: undefined }}>
            Get the Guide — $47
          </Link>
        </Button>
        <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
          This is peer-support education, not therapy or emergency care. If you may be in danger,
          contact local emergency services or call/text 988.
        </p>
      </section>
    </div>
  );
}
