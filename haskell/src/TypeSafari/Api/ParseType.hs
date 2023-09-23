{-# LANGUAGE DeriveAnyClass #-}
{-# LANGUAGE DerivingStrategies #-}
{-# LANGUAGE RecordWildCards #-}

module TypeSafari.Api.ParseType where

import Data.Aeson
import GHC.Generics
import Data.Text (Text)
import Prelude
import TypeSafari.HindleyMilner.Parse (parseType, ParseTypeResult (..), ParseError)
import TypeSafari.HindleyMilner.Syntax.Concrete (LocatedType)

--------------------------------------------------------------------------------

newtype Input = Input {
    inputText :: Text
  }
  deriving stock (Show, Generic)
  deriving anyclass FromJSON

data Output = Output {
    outputType :: Maybe LocatedType,
    outputError :: Maybe OutputError
  }
  deriving stock (Generic)
  deriving anyclass ToJSON

data OutputError
  = OutputParseError ParseError
  | OutputUnknownError Text
  deriving stock (Generic)
  deriving anyclass (ToJSON)

--------------------------------------------------------------------------------

run :: Input -> IO Output
run Input{..} = pure $
  case parseType inputText of
    Left err ->
      Output {
        outputType = Nothing,
        outputError = Just (OutputParseError err)
      }
    Right ParseTypeResult{ parsedType } ->
      Output {
        outputType = Just parsedType,
        outputError = Nothing
      }

dispError :: Text -> Output
dispError t =
  Output {
    outputType = Nothing,
    outputError = Just (OutputUnknownError t)
  }