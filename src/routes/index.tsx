import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Heart,
  Compass,
  ShieldAlert,
  BookOpen,
  MessageCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <Hero />
      <AmbushMoment />
      <WhyThisHappens />
      <WhatsInside />
      <AiCompanion />
      <FounderCredibility />
      <WhatThisIsNot />
      <Pricing />
      <Faq />
      <ClosingCta />
      <SiteFooter />
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="border-b border-border/70 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" strokeWidth={1.75} />
          <span className="font-serif text-lg tracking-tight">Ncredible Solutions</span>
        </div>
        <a href="#pricing">
          <Button variant="default" size="sm">
            Get the Trigger Map
          </Button>
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="mx-auto max-w-4xl px-6 pb-16 pt-16 text-center sm:pt-24">
      <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-medium tracking-wide text-secondary-foreground">
        <Sparkles className="h-3.5 w-3.5" />
        FIVE STEPS TO HEALING
      </p>
      <h1 className="text-balance font-serif text-4xl leading-tight tracking-tight sm:text-5xl sm:leading-tight">
        The first year after loss doesn't need to break you.
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
        A gentle, honest roadmap for the days you can't see past — written by someone who has
        buried a child, both parents, and still had to show up for three grieving grandchildren
        the next morning.
      </p>
      <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a href="#pricing">
          <Button size="lg" className="gap-2">
            Start with the First-Year Trigger Map
            <ArrowRight className="h-4 w-4" />
          </Button>
        </a>
        <a href="#whats-inside">
          <Button size="lg" variant="outline">
            See what's inside
          </Button>
        </a>
      </div>
      <p className="mt-5 text-xs text-muted-foreground">
        Not therapy. Not a fix. A hand to hold when the calendar turns cruel.
      </p>
    </section>
  );
}

function AmbushMoment() {
  return (
    <section className="border-y border-border/70 bg-secondary/60">
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h2 className="font-serif text-2xl tracking-tight sm:text-3xl">
          You made it through the funeral. Then Tuesday ambushed you.
        </h2>
        <p className="mt-5 text-pretty text-muted-foreground">
          Nobody warns you about the grocery store aisle, the ringtone you can't change, the
          birthday that shows up on your calendar whether you're ready or not. The worst grief
          moments rarely arrive on the anniversary. They arrive sideways — in traffic, at
          checkout, at 2 a.m. — and there's almost never a plan for what to do in that exact
          minute.
        </p>
        <p className="mt-4 text-pretty font-medium text-foreground">
          This is a plan for that exact minute.
        </p>
      </div>
    </section>
  );
}

function WhyThisHappens() {
  const points = [
    {
      title: "Grief doesn't follow a calendar",
      body: "It follows triggers — smells, songs, dates, empty chairs at the table. Most grief resources are organized by month or stage. Real grief doesn't cooperate with either.",
    },
    {
      title: "You're still the responsible one",
      body: "Final arrangements, estate calls, other people's grief to hold space for. The support you need has to fit into a life that hasn't stopped needing you.",
    },
    {
      title: "\"Just give it time\" isn't a plan",
      body: "Time helps. It's also not something you can act on at 11:40 p.m. when a memory ambushes you and you need to know what to actually do next.",
    },
  ];
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="font-serif text-2xl tracking-tight sm:text-3xl">
          Why the usual grief advice doesn't land
        </h2>
      </div>
      <div className="grid gap-6 sm:grid-cols-3">
        {points.map((p) => (
          <Card key={p.title} className="border-border/70">
            <CardContent className="pt-6">
              <h3 className="font-serif text-lg">{p.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{p.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function WhatsInside() {
  const items = [
    {
      icon: Compass,
      title: "The First-Year Trigger Map",
      body: "A trigger-indexed guide — not a stage-indexed one. Find the moment you're in (an anniversary, a first holiday, an unexpected reminder) and go straight to what actually helps.",
    },
    {
      icon: BookOpen,
      title: "The Grief Toolkit",
      body: "Practical companion workbook for the logistics grief doesn't warn you about — the financial strain, the decisions, the paperwork of loss.",
    },
    {
      icon: Heart,
      title: "Health Loss & Estrangement Workbooks",
      body: "For the losses people don't send casseroles for: a health diagnosis, a fractured family relationship, a version of your future that quietly ended.",
    },
    {
      icon: MessageCircle,
      title: "The Next Survivable Step Companion",
      body: "A free, always-available tool that asks three quiet questions and hands you one honest next step — no login, no diagnosis, no pretending you're further along than you are.",
    },
  ];
  return (
    <section id="whats-inside" className="border-t border-border/70 bg-secondary/40">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="font-serif text-2xl tracking-tight sm:text-3xl">
            What's inside the Five Steps to Healing suite
          </h2>
          <p className="mt-4 text-muted-foreground">
            Four pieces, built to work alone or together — start with whichever meets you where
            you are.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {items.map((item) => (
            <Card key={item.title} className="border-border/70 bg-card">
              <CardContent className="flex gap-4 pt-6">
                <item.icon className="h-6 w-6 shrink-0 text-primary" strokeWidth={1.75} />
                <div>
                  <h3 className="font-serif text-lg">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function AiCompanion() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <div className="grid items-center gap-10 sm:grid-cols-2">
        <div>
          <p className="mb-3 text-xs font-medium tracking-wide text-primary">
            FREE, AVAILABLE 24/7
          </p>
          <h2 className="font-serif text-2xl tracking-tight sm:text-3xl">
            When it's 2 a.m. and the book is on the shelf across the room
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            The Next Survivable Step Companion is a quiet, private tool for the moment you can't
            get to the book. Answer three short questions about where you are right now, and it
            hands you one small, honest next step — nothing more.
          </p>
          <a href="#pricing" className="mt-6 inline-block">
            <Button variant="outline" className="gap-2">
              Try the companion tool
              <ArrowRight className="h-4 w-4" />
            </Button>
          </a>
        </div>
        <Card className="border-border/70 bg-secondary/50">
          <CardContent className="pt-6 text-sm text-muted-foreground">
            <p className="font-serif text-base text-foreground">How it works</p>
            <ol className="mt-3 space-y-2">
              <li>1. Tell it what's happening right now.</li>
              <li>2. Tell it how much capacity you have in this moment.</li>
              <li>3. Tell it whether you're alone or with someone.</li>
            </ol>
            <p className="mt-4">
              It hands back one grounded, doable next step — not a diagnosis, not a lecture.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function FounderCredibility() {
  return (
    <section className="border-y border-border/70 bg-secondary/40">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <p className="mb-4 text-xs font-medium tracking-wide text-primary">WHY I BUILT THIS</p>
        <blockquote className="font-serif text-xl leading-relaxed text-foreground sm:text-2xl">
          "I've spent more than 25 years as an HR professional, counseling people through the
          hardest days of their working lives. And then I lived it myself — losing my only child,
          then my father six months later, then my mother. I had to delay my own grief to be
          present for the three children she left behind. This suite is what I wish someone had
          handed me."
        </blockquote>
        <p className="mt-6 text-sm text-muted-foreground">
          — Founder, Ncredible Solutions
        </p>
      </div>
    </section>
  );
}

function WhatThisIsNot() {
  const items = [
    "A replacement for therapy, medical care, or crisis support",
    "A promise that grief follows a schedule, or that you'll be \"done\" by a certain date",
    "A diagnosis of what you're feeling, or a judgment on how you're feeling it",
  ];
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <div className="rounded-2xl border border-warning-border bg-warning px-6 py-8 text-warning-foreground sm:px-10 sm:py-10">
        <div className="flex items-center gap-3">
          <ShieldAlert className="h-5 w-5 shrink-0" strokeWidth={1.75} />
          <h2 className="font-serif text-xl tracking-tight">What this is not</h2>
        </div>
        <ul className="mt-5 space-y-3 text-sm">
          {items.map((item) => (
            <li key={item} className="flex gap-2.5">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm">
          If you're in crisis or thinking about harming yourself, please reach out to a crisis
          line or emergency services in your area right now. This suite is here for the long,
          slow work of getting through — it isn't built for emergencies.
        </p>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="border-t border-border/70 bg-secondary/40">
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h2 className="font-serif text-2xl tracking-tight sm:text-3xl">
          Start with the First-Year Trigger Map
        </h2>
        <p className="mt-4 text-muted-foreground">
          The single best place to begin. Everything else in the suite builds on it.
        </p>
        <Card className="mx-auto mt-8 max-w-sm border-border/70 bg-card text-left">
          <CardContent className="pt-6">
            <p className="font-serif text-lg">The First-Year Trigger Map</p>
            <p className="mt-2 text-3xl font-semibold">$47</p>
            <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" /> Trigger-indexed guide,
                not stage-indexed
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" /> Written for the
                responsible one, not just the griever
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" /> Free access to the
                Next Survivable Step Companion
              </li>
            </ul>
            <Button className="mt-6 w-full gap-2" size="lg">
              Get the Trigger Map — $47
              <ArrowRight className="h-4 w-4" />
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Instant download. Full suite (Toolkit, Health Loss & Estrangement workbooks)
              available after.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function Faq() {
  const faqs = [
    {
      q: "Is this therapy or a replacement for professional support?",
      a: "No. This suite is educational and supportive material, not a substitute for therapy, medical care, or crisis intervention. Many people use it alongside professional support.",
    },
    {
      q: "What if my loss isn't a death — it's a divorce, an estrangement, or a diagnosis?",
      a: "The suite includes dedicated workbooks for health loss, family estrangement, and breakup or divorce grief specifically, because those losses are real and rarely get named as grief.",
    },
    {
      q: "How is this different from other grief books?",
      a: "Most grief books are organized by stage or by month. This one is organized by trigger — the actual moment you're standing in — because that's when you need help, not on a schedule someone else set.",
    },
    {
      q: "Do I need to buy the whole suite to start?",
      a: "No. The First-Year Trigger Map stands alone and is the recommended starting point. The rest of the suite is there when and if you need it.",
    },
  ];
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h2 className="mb-8 text-center font-serif text-2xl tracking-tight sm:text-3xl">
        Questions before you start
      </h2>
      <Accordion type="single" collapsible>
        {faqs.map((faq, i) => (
          <AccordionItem key={faq.q} value={`item-${i}`}>
            <AccordionTrigger className="font-serif text-base">{faq.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

function ClosingCta() {
  return (
    <section className="border-t border-border/70 bg-secondary/60">
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h2 className="font-serif text-2xl tracking-tight sm:text-3xl">
          You don't have to figure out the next step alone.
        </h2>
        <p className="mt-4 text-muted-foreground">
          Start with the First-Year Trigger Map, or try the free companion tool right now.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href="#pricing">
            <Button size="lg" className="gap-2">
              Get the Trigger Map
              <ArrowRight className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-border/70">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-xs text-muted-foreground sm:flex-row">
        <p>© {new Date().getFullYear()} Ncredible Solutions. All rights reserved.</p>
        <Link to="/" className="hover:text-foreground">
          Five Steps to Healing
        </Link>
      </div>
      <div className="mx-auto max-w-6xl px-6 pb-8 text-center">
        <p className="text-xs text-muted-foreground">© 2026 Ncredible Solutions. All rights reserved.</p>
      </div>
    </footer>
  );
}
