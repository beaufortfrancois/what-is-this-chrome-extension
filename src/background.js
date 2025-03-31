// Copyright 2025 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "id",
    contexts: ["image"],
    title: "What is this image?",
  });
});

async function generateAltText(srcUrl) {
  let image = document.querySelector(`[src="${srcUrl}"]`);
  if (!image) {
    image = await (await fetch(srcUrl)).blob();
  }
  const session = await LanguageModel.create({
    expectedInputs: [{ type: "image" }],
  });
  const content = await createImageBitmap(image);
  const prompt = "Generate a very short alt text for this image.";
  const response = await session.prompt([prompt, { type: "image", content }]);
  speechSynthesis.speak(new SpeechSynthesisUtterance(response));
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id, allFrames: true },
    func: generateAltText,
    args: [info.srcUrl]
  });
});
