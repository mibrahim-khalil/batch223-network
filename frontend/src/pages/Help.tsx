import Navbar from "../components/Navbar";

export default function Help() {
  return (
    <main className="min-h-screen bg-canvas text-ink">
      <Navbar />

      <div className="max-w-[960px] mx-auto px-6 md:px-12 py-section">
        <p className="label">Help</p>

        <h1 className="mt-3 font-display uppercase text-[56px] md:text-[72px] leading-[0.9]">
          SEBatch223 Network
        </h1>

        <p className="mt-4 text-mute leading-7">
          SEBatch223 Network is a private community platform for CUST SE Batch 223.
          It helps batchmates reconnect, share opportunities, and stay updated—securely.
        </p>

        {/* What is this */}
        <section className="mt-section border-t border-hairline pt-section">
          <h2 className="font-display uppercase text-2xl leading-none">
            What is this website?
          </h2>

          <div className="mt-6 space-y-4 text-charcoal leading-7">
            <p>
              This is a private alumni / batch community network where verified students
              can create profiles, browse the directory, post announcements, and share
              jobs and events.
            </p>
            <p>
              Access is restricted to the students of department of Software Engineering Batch 223 emails to keep the community private
              and trusted.
            </p>
          </div>
        </section>

        {/* Benefits */}
        <section className="mt-section border-t border-hairline pt-section">
          <h2 className="font-display uppercase text-2xl leading-none">
            Benefits
          </h2>

          <ul className="mt-6 space-y-3 text-charcoal leading-7 list-disc pl-5">
            <li>Reconnect with batchmates through the Directory.</li>
            <li>Show your skills, experience, and education on your profile.</li>
            <li>Share Jobs & Internships with the batch.</li>
            <li>Create Events and meetups.</li>
            <li>Post Announcements and updates (admin approval for students).</li>
          </ul>
        </section>

        {/* How to */}
        <section className="mt-section border-t border-hairline pt-section">
          <h2 className="font-display uppercase text-2xl leading-none">
            How to use
          </h2>

          <div className="mt-6 space-y-6">
            <div className="border border-hairline-soft bg-soft-cloud p-6">
              <p className="label text-ink">1) Register + Verify Email</p>
              <p className="mt-3 text-charcoal leading-7">
                Register using your Batch223 email (e.g. <span className="font-medium">bse223XXX@cust.pk</span>).
                You will receive a 6-digit OTP. Enter it on the verification screen.
              </p>
            </div>

            <div className="border border-hairline-soft bg-soft-cloud p-6">
              <p className="label text-ink">2) Complete your Profile</p>
              <p className="mt-3 text-charcoal leading-7">
                Go to <span className="font-medium">Profile → Edit Profile</span> and add:
                headline, city, skills, experience, education, and contact links.
              </p>
            </div>

            <div className="border border-hairline-soft bg-soft-cloud p-6">
              <p className="label text-ink">3) Upload Avatar/Cover/Resume</p>
              <p className="mt-3 text-charcoal leading-7">
                In Edit Profile, use Uploads to upload your profile picture, cover banner,
                and resume (PDF). These are stored on Cloudinary.
              </p>
            </div>

            <div className="border border-hairline-soft bg-soft-cloud p-6">
              <p className="label text-ink">4) Directory</p>
              <p className="mt-3 text-charcoal leading-7">
                Browse the directory to find batchmates. Use filters for name, company, city, and skills.
              </p>
            </div>

            <div className="border border-hairline-soft bg-soft-cloud p-6">
              <p className="label text-ink">5) Posts (Announcements / Jobs / Events)</p>
              <p className="mt-3 text-charcoal leading-7">
                Students can submit posts, but they appear publicly only after admin approval.
                Admin posts publish instantly.
              </p>
            </div>
          </div>
        </section>

        {/* Troubleshooting */}
        <section className="mt-section border-t border-hairline pt-section">
          <h2 className="font-display uppercase text-2xl leading-none">
            Troubleshooting
          </h2>

          <div className="mt-6 space-y-4 text-charcoal leading-7">
            <div>
              <p className="font-medium text-ink">OTP not received?</p>
              <p className="text-mute">
                In development, OTP can be printed in the backend terminal (MAIL_MODE=log).
              </p>
            </div>

            <div>
              <p className="font-medium text-ink">Uploads fail?</p>
              <p className="text-mute">
                Make sure your Cloudinary API key is “Master Admin” (upload allowed),
                and try a smaller image if it’s very large.
              </p>
            </div>

            <div>
              <p className="font-medium text-ink">I can’t see my post</p>
              <p className="text-mute">
                If you’re a student, posts remain pending until approved by an admin.
                You can still view your own pending posts.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-section border-t border-hairline pt-section">
          <h2 className="font-display uppercase text-2xl leading-none">
            Support
          </h2>
          <p className="mt-6 text-charcoal leading-7">
            If you face any issue, contact the batch admin(s) and share a screenshot
            of the problem and the URL you were on.
          </p>
        </section>
      </div>
    </main>
  );
}