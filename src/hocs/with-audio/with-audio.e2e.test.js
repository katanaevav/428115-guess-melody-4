import React from "react";
import {configure, mount} from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import withAudio from "./with-audio.js";

configure({adapter: new Adapter()});

const Player = (props) => {
  const {onPlayButtonClick, children} = props;
  return (
    <div>
      <button onClick={onPlayButtonClick} />
      {children}
    </div>
  );
};

it(`Checks that HOC's callback turn on audio (play)`, () => {
  const PlayerWrapped = withAudio(Player);
  const onPlayButtonClick = jest.fn();
  const wrapper = mount(<PlayerWrapped
    isPlaying={false}
    onPlayButtonClick={onPlayButtonClick}
    src=""
  />);

  window.HTMLMediaElement.prototype.play = onPlayButtonClick;
  window.HTMLMediaElement.prototype.pause = () => {};

  const {_audioRef} = wrapper.instance();

  const pauseStub = jest.spyOn(_audioRef.current, `play`).mockImplementation(() => {});

  wrapper.instance().componentDidMount();

  wrapper.find(`button`).simulate(`click`);

  expect(pauseStub).toHaveBeenCalledTimes(1);
});


it(`Checks that HOC's callback turn off audio (pause)`, () => {
  const PlayerWrapped = withAudio(Player);
  const onPlayButtonClick = jest.fn();
  const wrapper = mount(<PlayerWrapped
    isPlaying={true}
    onPlayButtonClick={onPlayButtonClick}
    src=""
  />);

  window.HTMLMediaElement.prototype.pause = onPlayButtonClick;
  window.HTMLMediaElement.prototype.play = () => {};

  const {_audioRef} = wrapper.instance();

  const pauseStub = jest.spyOn(_audioRef.current, `pause`).mockImplementation(() => {});

  wrapper.instance().componentDidMount();

  wrapper.find(`button`).simulate(`click`);

  expect(pauseStub).toHaveBeenCalledTimes(1);
});
